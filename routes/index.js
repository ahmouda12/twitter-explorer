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

// router.get('/search', (req, res, next) => {
//   // search2.word = req.body.word;
//   console.log(req);
// });

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
let stream;
console.log("req.query: ",req.query);
console.log("req.query.trackSearch: ",!req.query.trackSearch);
let tracking = req.query.trackSearch;
// if (req.query.trackSearch) {
//   // console.log(true)
//   stream = client.stream('statuses/filter', { track: tracking });
// }
//   else {
//   //   // console.log(false)
//     stream = client.stream('statuses/sample', { });
//   }
  stream = client.stream('statuses/filter', { track: "hurricane" });

  stream.on('tweet', function (data) {
    // console.log(data.text);
    if (data.place){
      if (data.place.bounding_box.coordinates !== null){
        let bbox = data.place.bounding_box.coordinates;
        let bbox2 = new BoundingBox({ minlat: bbox[0][0][1], minlon: bbox[0][0][0], maxlat: bbox[0][2][1], maxlon: bbox[0][2][0] });
        let bboxCenter = bbox2.getCenter();
        let loc = [bboxCenter.lat, bboxCenter.lon];
        console.log("location:", loc);


        let tweet = {
          created_at: data.created_at,
          text: data.text,
          username: data.user.screen_name,
          followers_count: data.user.followers_count,
          following_count: data.user.following_count,
          statuses_count: data.user.statuses_count,
          profile_image_url: data.user.profile_image_url,
          coordinaties: loc
        };
        res.io.emit('stream', tweet);
      }
    }
  });

  stream.on('error', (error) => {
    console.log("-----=======-----", error);
    throw error;
  });

});

module.exports = router;
