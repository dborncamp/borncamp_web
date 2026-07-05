# Wedding Endpoint Implementation

Add an endpoint to my website for a wedding that is `/wedding` that contains 3 different pieces, an RSVP form, an FAQ section, and a gallery of photos. 
Here is a simple implementation of the `/wedding` endpoint that includes an RSVP form, an FAQ, and a gallery of photos:

## RSVP Form

The form for an event RSVP that includes the following fields:

- Name(s) (required) (string)
- Email (required) (string)
- Address (required) (string)
- Attending? (required) (boolean)
- Number of people in party? (required) (integer)
- How many kids? (optional) (integer)
- Vegitarian? (optional) (integer)
- Photo upload (optional)

If there are any errors in the form submission, such as missing required fields or invalid data, the user should be notified and prompted to correct them.

If the kids is not filled out, assume that there are 0 kids.

If the vegetarian field is not filled out, assume that there are 0 vegetarians.

Add the ability to save the photos to an S3 bucket called `s3://borncamp/wedding/photos/` in the `us-west-1` region and store the URL in the Mongo database.

Add calls to a Mongo database to store all of the collected information about RSVP submissions.

## FAQ Section

The FAQ section should include common questions and answers about the wedding, such as dress code, location, and accommodations. 
The questions are:

- Are Kids allowed?
    - Yes
- Location
    - The wedding will take place at Moss Denver, located at 200 Santa Fe Dr, Denver, CO 80223.
- Parking
    - Parking is available across the street from the venue, but we encourage carpooling or using ride-sharing services.
- What is the Schedule?
    - Starting at 4:00 PM until 11:00 PM
- Is there a Registry?
    - No, your presence is presence enough
- What is the Dress Code?
    - Semi-formal attire is recommended for the wedding`.
- Will there be an open bar?
    - Yes, there will be an open bar available for guests with a large selection of select whiskeys and non-alcoholic beverages.


## Gallery of Photos

The gallery of photos should display images from the couple's engagement and other related events.
It should allow users to upload their own photos from the wedding, which will be displayed in the gallery.
It should also include uploaded photos from the RSVP form. 

The gallery should be visually appealing and easy to navigate, with options to view larger versions of the images.
The gallery should be implemented using a grid layout, with each image displayed as a thumbnail. When a user clicks on a thumbnail, a modal should open to display the larger version of the image.
