const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userName: {
    type: String,
    required: true
  },
  token : {
    type: String,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: { type: String},
  bio: {
    type: String
  },
  image: {
    type: String
  }
}, {
  collection : 'user'
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}


userSchema.plugin(uniqueValidator, { message: 'is already taken.' });

mongoose.model('User', userSchema);