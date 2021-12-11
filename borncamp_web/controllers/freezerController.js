import {Freezer} from '../models/freezerTemp'

const mongoHost = process.env.MONGO_HOST || "http://localhost/";
const mongoPort = process.env.MONGO_PORT || 27017;

/**
 * Post freezer data
 */
exports.postData = (req, res) => {
    console.log(req.body);
    var freezerTemp = new Freezer {
        req.body
    }
};

exports.getData = (req, res, host, port) => {
    console.log(req.body);
    var mongoDB = `mongodb://${mongoHost}:${mongoPort}/freezer`;

    mongoose.connect(mongoDB, { useNewUrlParser: true });
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB connection error:'));


    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(Freezer));
};