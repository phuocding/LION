const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const config = require('./config/config');

exports.isAuthenticated = function (req, res, next) {
  // console.log(req.headers);
  if (req.headers &&
    req.headers.authorization) {

    let jwtToken = req.headers.authorization;
    jwt.verify(jwtToken, config.secret, function (err, payload) {
      // console.log(payload);
      if (err) {
        return res.status(401).json({ message: 'Auth Unauthorized user!' });
      } else {
        // console.log('decoder: ' + payload);
        req.user = payload;
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'Unauthorized user!' });
  }
};