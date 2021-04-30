const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');

const User = require('../models/user');

require('dotenv').config();

const transporter = nodemailer.createTransport(sendGridTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}));

const getMessage = (message) => {
  if (message.length > 0) {
    return message[0];
  }
    return null;
}

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  message = getMessage(message);

  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
    oldInput: { email: '', password: ''},
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  message = getMessage(message);

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput: { email: '', password: '', confirmPassword: ''},
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      oldInput: { email, password},
    });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
          validationErrors: [],
          oldInput: { email, password},
        });
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              return res.redirect('/');
            });
          }

          req.flash('error', 'Invalid email or password');
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password',
            validationErrors: [],
            oldInput: { email, password},
          });
        })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword: req.body.confirmPassword },
      validationErrors: errors.array(),
    });
  }

  return bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const newUser = new User({
        email,
        password: hashedPassword,
        cart: {
          items: []
        }
      });
      return newUser.save();
    })
    .then(result => {
      res.redirect('/login');
      return transporter.sendMail({
        to: email,
        from: process.env.SENGRID_SENDER,
        subject: 'Signup',
        html: '<h1>You successsfully signed up!</h1>'
      })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  message = getMessage(message);

  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message
  })
}

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }

    const token = buffer.toString('hex');

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/reset');
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {
        res.redirect('/');

        return transporter.sendMail({
          to: req.body.email,
          from: process.env.SENGRID_SENDER,
          subject: 'Password Reset',
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          `
        })
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  })
}

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      message = getMessage(message);

      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
      })
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.postNewPassword = (req, res, next) => {
  const password = req.body.password;
  const userId = req.body.userId;
  const token = req.body.passwordToken;
  let resetUser;

  User
    .findOne({
      _id: userId,
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    })
    .then(user => {
      resetUser = user;

      return bcrypt.hash(password, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = null;
      resetUser.resetTokenExpiration = null;

      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}
