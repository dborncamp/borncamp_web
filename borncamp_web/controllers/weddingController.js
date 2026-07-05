/**
 * Wedding page: RSVP form, FAQ, and guest photo uploads.
 *
 * Photos are uploaded to s3://borncamp/wedding/photos/ (us-west-1) and their
 * URLs, along with RSVP submissions, are stored in MongoDB. Uploaded photos
 * are not displayed on the page.
 *
 * Configuration (environment variables):
 *   MONGODB_URI - Mongo connection string (default mongodb://localhost:27017)
 *   MONGODB_DB  - database name (default borncamp)
 *   AWS credentials are picked up from the standard AWS SDK provider chain.
 */
const crypto = require('crypto');
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { MongoClient } = require('mongodb');

const S3_BUCKET = 'borncamp';
const S3_REGION = 'us-west-1';
const S3_PREFIX = 'wedding/photos/';

const RSVP_COLLECTION = 'weddingRsvps';
const PHOTO_COLLECTION = 'weddingPhotos';

const s3 = new S3Client({ region: S3_REGION });

const mongoClient = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017', {
    serverSelectionTimeoutMS: 5000
});
let db;

async function getDb() {
    if (!db) {
        await mongoClient.connect();
        db = mongoClient.db(process.env.MONGODB_DB || 'borncamp');
    }
    return db;
}

const faq = [
    {
        question: 'Are kids allowed?',
        answer: 'Yes'
    },
    {
        question: 'Location',
        answer: 'The wedding will take place at Moss Denver, located at 200 Santa Fe Dr, Denver, CO 80223.'
    },
    {
        question: 'Parking',
        answer: 'Parking is available across the street from the venue, but we encourage carpooling or using ride-sharing services.'
    },
    {
        question: 'What is the schedule?',
        answer: 'Starting at 4:00 PM until 11:00 PM'
    },
    {
        question: 'Is there a registry?',
        answer: 'No, your presence is presence enough'
    },
    {
        question: 'What is the dress code?',
        answer: 'Semi-formal attire is recommended for the wedding.'
    },
    {
        question: 'Will there be an open bar?',
        answer: 'Yes, there will be an open bar available for guests with a large selection of select whiskeys and non-alcoholic beverages.'
    }
];

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, files: 10 },
    fileFilter: (req, file, cb) => {
        cb(null, file.mimetype.startsWith('image/'));
    }
});

// One-shot flash store so form values and error messages survive the
// redirect back to GET /wedding (Post/Redirect/Get). In-memory is fine here:
// the app is a single process and flash data only needs to live for the one
// redirect. Entries expire in case the redirect is never followed.
const flashStore = new Map();
const FLASH_TTL_MS = 5 * 60 * 1000;

function stashFlash(data) {
    const now = Date.now();
    for (const [id, entry] of flashStore) {
        if (entry.expires < now) flashStore.delete(id);
    }
    const id = crypto.randomBytes(16).toString('hex');
    flashStore.set(id, { data, expires: now + FLASH_TTL_MS });
    return id;
}

function popFlash(id) {
    const entry = flashStore.get(id);
    if (!entry) return null;
    flashStore.delete(id);
    return entry.expires < Date.now() ? null : entry.data;
}

function redirectWithFlash(res, anchor, data) {
    return res.redirect(303, `/wedding?flash=${stashFlash(data)}#${anchor}`);
}

// Parse a multipart form with up to 10 images in the "photos" field. On a
// multer error (e.g. a file over the size limit) redirect back to /wedding
// with the message under the section named by errKey instead of falling
// through to the generic error handler.
function handleUpload(errKey, anchor) {
    return (req, res, next) => {
        upload.array('photos', 10)(req, res, (err) => {
            if (err) {
                return redirectWithFlash(res, anchor, { [errKey]: `Photo upload failed: ${err.message}` });
            }
            return next();
        });
    };
}

exports.rsvpUpload = handleUpload('rsvpError', 'rsvp');
exports.galleryUpload = handleUpload('galleryError', 'gallery');

async function savePhotoToS3(file) {
    const safeName = file.originalname.replace(/[^\w.-]/g, '_');
    const key = `${S3_PREFIX}${Date.now()}-${crypto.randomBytes(8).toString('hex')}-${safeName}`;
    await s3.send(new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
    }));
    return `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
}

function renderWedding(res, extra = {}) {
    res.render('wedding', {
        title: 'Our Wedding',
        faq,
        form: {},
        errors: {},
        ...extra
    });
}

/**
 * GET /wedding
 *
 * All submissions redirect back here (Post/Redirect/Get) so refreshing never
 * re-submits the form: successes carry a query flag for the banner, failures
 * carry a one-shot flash id holding the form values and error messages.
 */
exports.index = (req, res) => renderWedding(res, {
    rsvpSuccess: req.query.rsvp === 'success',
    gallerySuccess: req.query.photos === 'success',
    ...(req.query.flash ? popFlash(req.query.flash) : null)
});

exports.validateRsvp = [
    body('names').trim().notEmpty().withMessage('Name(s) is required'),
    body('email').trim().isEmail().withMessage('A valid email is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('attending').isIn(['yes', 'no']).withMessage('Please tell us whether you are attending'),
    body('partySize').isInt({ min: 1 }).withMessage('Number of people in your party must be a whole number of at least 1'),
    body('kids').optional({ values: 'falsy' }).isInt({ min: 0 }).withMessage('Number of kids must be a whole number of 0 or more'),
    body('vegetarians').optional({ values: 'falsy' }).isInt({ min: 0 }).withMessage('Number of vegetarians must be a whole number of 0 or more')
];

/**
 * POST /wedding/rsvp
 */
exports.submitRsvp = async (req, res) => {
    const result = validationResult(req);
    const form = req.body;
    if (!result.isEmpty()) {
        const errors = {};
        result.array().forEach((e) => {
            if (!errors[e.path]) errors[e.path] = e.msg;
        });
        return redirectWithFlash(res, 'rsvp', { form, errors, rsvpError: 'Please correct the errors below and resubmit.' });
    }

    try {
        const photoUrls = [];
        for (const file of req.files || []) {
            photoUrls.push(await savePhotoToS3(file));
        }

        const rsvp = {
            names: form.names.trim(),
            email: form.email.trim(),
            address: form.address.trim(),
            attending: form.attending === 'yes',
            partySize: parseInt(form.partySize, 10),
            kids: form.kids ? parseInt(form.kids, 10) : 0,
            vegetarians: form.vegetarians ? parseInt(form.vegetarians, 10) : 0,
            photoUrls,
            submittedAt: new Date()
        };

        const database = await getDb();
        await database.collection(RSVP_COLLECTION).insertOne(rsvp);
        if (photoUrls.length) {
            await database.collection(PHOTO_COLLECTION).insertMany(photoUrls.map((url) => ({
                url,
                uploadedBy: rsvp.names,
                source: 'rsvp',
                uploadedAt: new Date()
            })));
        }

        return res.redirect(303, '/wedding?rsvp=success#rsvp');
    } catch (err) {
        console.error('RSVP submission failed:', err);
        return redirectWithFlash(res, 'rsvp', { form, rsvpError: 'Something went wrong saving your RSVP. Please try again.' });
    }
};

/**
 * POST /wedding/photos
 */
exports.submitPhotos = async (req, res) => {
    if (!req.files || !req.files.length) {
        return redirectWithFlash(res, 'gallery', { galleryError: 'Please choose at least one image to upload.' });
    }

    try {
        const urls = [];
        for (const file of req.files) {
            urls.push(await savePhotoToS3(file));
        }

        const database = await getDb();
        await database.collection(PHOTO_COLLECTION).insertMany(urls.map((url) => ({
            url,
            uploadedBy: (req.body.uploadedBy || 'Guest').trim(),
            source: 'gallery',
            uploadedAt: new Date()
        })));

        return res.redirect(303, '/wedding?photos=success#gallery');
    } catch (err) {
        console.error('Gallery upload failed:', err);
        return redirectWithFlash(res, 'gallery', { galleryError: 'Something went wrong uploading your photos. Please try again.' });
    }
};
