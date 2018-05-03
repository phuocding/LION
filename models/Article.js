const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  // slug
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  tagList: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date,
    required: true
  },
  favorited: {
    type: Boolean
  },
  favoritesCount: {
    type: Number
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

module.exports = mongoose.model('Article', userSchema);

