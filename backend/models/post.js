const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true}, // String is shorthand for {type: String}
  content: { type: String, required: true}
});

module.exports = mongoose.model('Post', postSchema);
