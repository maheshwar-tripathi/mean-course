const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const User = require('../models/user');

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });

      user.save()
        .then(result => {
          res.status(201).json({
            message: "User created!",
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });
});

router.post("/login", (req, res, next) => {
  let fectchedUser;

  User.findOne({ email: req.body.email })
    .then( user => {
      fectchedUser = user;
      if(!user) {
        return res.status(401).json({
          message: "Auth Failed!"
        });
      }
      return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
      if(!result) {
        return res.status(401).json({
          message: 'Auth Failed!'
        });
      }
      const token = jwt.sign(
        {email: fectchedUser.email, userId: fectchedUser._id},
        'secret_key_this_should_be_longer',
        { expiresIn: '1h' }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fectchedUser._id
      });
    })
    .catch(error => {
      return res.status(401).json({
        message: 'Auth Failed!'
      });
    });
});

module.exports = router;
