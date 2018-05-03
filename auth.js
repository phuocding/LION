const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const config = require('./config/config')

const User = require("./models/User");

exports.isAuthenticated = function (req, res, next) {
  if (req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'JWT') {

    var jwtToken = req.headers.authorization.split(' ')[1];
    jwt.verify(jwtToken, config.secret, function (err, payload) {

      if (err) {
        res.status(401).json({ message: 'Unauthorized user!' });
      } else {
        console.log('decoder: ' + payload.username);
        // find
        User.findOne({
          'username': payload.username
        }, function (err, user) {
          if (user) {
            req.user = user;
            next();
          } else {
            res.status(401).json({ message: 'Unauthorized user!' });
          }
        })
      }
    });
  } else {
    res.status(401).json({ message: 'Unauthorized user!' });
  }
};