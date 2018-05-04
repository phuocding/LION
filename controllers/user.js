const router =require('express').Router();
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const User = mongoose.model('User');

const config = require('../config/config')

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
              
              user.userName= req.body.user.userName,
              user.email= req.body.user.email,
              user.password= hash
            
            user
              .save()
              .then(() => {
                //console.log(result);
                return res.json({user: user.toAuthFor()});
              })
              .catch(next);
          }
        });
      }
    });
});

// login
router.post("/api/users/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              token: user[0].token,
              userId: user[0]._id,
              bio: user[0].bio,
              image: user[0].image
            },
            config.secret,
            {
              expiresInMinutes: 2440
            }
          );
          console.log(`jwt is ${token}`);
          return res.status(200).json({
            success: true,
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;