const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  token : {
    type: String
  },
  email: {
    type: String,
    required: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: { type: String},
  bio: {
    type: String
  },
  image: {
    type: String
  }
});

userSchema.plugin(uniqueValidator, { message: 'is already taken.' });
userSchema.methods.comparePassword = function (password){
  return bcrypt.compareSync(password, this.password)
};

userSchema.methods.toJsonToken = function (){
  return jwt.sign({
    id:this._id,
    userName: this.userName,
    exp:parseInt(Math.floor(Date.now()/1000)+(60*60))
  },'secret');
}
userSchema.methods.toAuthFor = function (user){
  return{
    userName: this.userName,
    email: this.email,
    token: this.toJsonToken(),
    bio: this.bio,
    image: this.image
  }
}

mongoose.model('User', userSchema);