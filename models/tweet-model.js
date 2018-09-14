const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  created_at: Date,
  text: String,
  name: String,
  followers: Number,
  following: Number,
  statuses: Number,
  profile_image: { type: String },
  location: { type: { type: String }, coordinates: [Number] }
});

const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;