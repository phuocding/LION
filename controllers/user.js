const router = require('express').Router();
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const User = mongoose.model('User');
const auth = require('../auth');

const config = require('../config/config')

router.get('/api/user', auth.isAuthenticated, (req, res, next) => {
  console.log(`hello${req.user.userName}`);
  User.findOne({
    userName: req.user.userName
  }).then(user => {
    if (user) {
      return res.json(user);
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized user!' });
    }
  }).catch(next);
});

  // register
  router.post("/api/users", (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          return res.status(409).json({
            message: "Mail exists"
          });
        } else {
          // console.log(req.body.user.password)
          bcrypt.hash(req.body.user.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err
              });
            } else {
              const user = new User();
              user.userName = req.body.user.userName,
                user.email = req.body.user.email,
                user.password = hash
              user
                .save()
                .then(() => {
                  //console.log(result);
                  return res.json({ user: user.toAuthFor() });
                })
                .catch(next);
            }
          });
        }
      });
  });

  // login
  router.post("/api/users/login", (req, res, next) => {
    User.findOne({ email: req.body.user.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({
            message: "Auth failed here"
          });
        }
        bcrypt.compare(req.body.user.password, user.password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "password invalid"
            });
          }
          if (result) {
            user.token = user.toJsonToken();
            req.headers.authorization = user.token;
            return res.json({
              success: true,
              message: "Auth successful",
              user: user.toAuthFor()
            });
          }
          return res.json({
            message: "Auth failed"
          });
        });
      })
      .catch(next);
  });



  module.exports = router;