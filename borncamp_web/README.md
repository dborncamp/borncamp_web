# Borncamp Web Development

Makings of a private website using the MEAN stack deployed at (https://www.borncamp.net)[https://www.borncamp.net]
Also using Microsoft Visual Studio 2017 to do development to get used to working in an IDE.
That is why the structure of this repo is a little weird.

## Wedding page

The `/wedding` endpoint serves an RSVP form, an FAQ, and a photo gallery.
RSVP submissions and gallery photo records are stored in MongoDB, and uploaded
photos are saved to `s3://borncamp/wedding/photos/` in `us-west-1`.

Configuration (environment variables):

- `MONGODB_URI` - Mongo connection string (default `mongodb://localhost:27017`)
- `MONGODB_DB` - database name (default `borncamp`)
- AWS credentials for the S3 uploads come from the standard AWS SDK provider
  chain (`AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`, shared config, or an
  instance role).
