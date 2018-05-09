const mongoose = require('mongoose');
const slug = require('slugify');

const articleSchema = mongoose.Schema({
  // slug
  slug: {
    type: String,
    lowercase: true,
    unique: true
  },
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
articleSchema.plugin(uniqueValidator, { message: 'is already taken.' });

articleSchema.methods.slugify = () => {
  this.slug = `${slug(this.title) - (Math.random() * Math.pow(36, 6) | 0).toString(36)}`;
};

articleSchema.methods.toPublicJSON = (user) => {
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    tagList: this.tagList,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author ? this.author.getPublicProfile(user) : { username: 'userRemoved' }
  };
};

mongoose.model('Article', articleSchema);

