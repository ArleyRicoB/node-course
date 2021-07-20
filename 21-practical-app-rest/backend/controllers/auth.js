const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const User = require('../models/user');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();

    throw error;
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email,
        name,
        password: hashedPassword,
      });

      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: 'User created', userId: result._id })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
  
      next(error);
    })
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let userLoaded;

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('A user with this email could not be found');
        error.statusCode = 401;

        throw error;
      }

      userLoaded = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password');
        error.statusCode = 401;

        throw error;
      }

      const token = jwt.sign(
        {
          email: userLoaded.email,
          userId: userLoaded._id.toString()
        },
        process.env.AUTH_TOKEN,
        { expiresIn: '1h' }
      );

      res.status(200).json({ token, userId: userLoaded._id.toString() })
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
  
      next(err);
    })
}
