require('events').EventEmitter.defaultMaxListeners = 0;

const express = require('express');
const router  = express.Router();
const Twit = require('twit');
const BoundingBox = require('boundingbox');

const client = new Twit({
  consumer_key:         process.env.TWITTER_CONSUMER_KEY, 
  consumer_secret:      process.env.TWITTER_CONSUMER_SECRET, 
  access_token:         process.env.TWITTER_ACCESS_TOKEN_KEY, 
  access_token_secret:  process.env.TWITTER_ACCESS_TOKEN_SECRET
});

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
  const stream = client.stream('statuses/sample', { });

  stream.on('tweet', function (data2) {
    // console.log(data.text);
    if (data2.place){
      if (data2.place.bounding_box.coordinates !== null){
        let bbox = data2.place.bounding_box.coordinates;
        let bbox2 = new BoundingBox({ minlat: bbox[0][0][1], minlon: bbox[0][0][0], maxlat: bbox[0][2][1], maxlon: bbox[0][2][0] });
        let bboxCenter = bbox2.getCenter();
        let loc = [bboxCenter.lat, bboxCenter.lon];
        // console.log("location:", loc);

        let tweet = {
          created_at: data2.created_at,
          text: data2.text,
          username: data2.user.screen_name,
          followers_count: data2.user.followers_count,
          following_count: data2.user.following_count,
          statuses_count: data2.user.statuses_count,
          profile_image_url: data2.user.profile_image_url,
          coordinaties: loc
        };
        res.io.emit('stream2', tweet);
      }
    }
  });

  stream.on('error', (error) => {
    // console.log(error);
    throw error;
  });

});

module.exports = router;
