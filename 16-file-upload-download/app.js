const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

require('dotenv').config();

const errorController = require('./controllers/error');
const User = require('./models/user');

const mongodbURI = process.env.MONGOURL;
const secret = process.env.SECRET;

const app = express();

const sessionStore = new mongoDBStore({
  uri: mongodbURI,
  collection: 'sessions'
});

const csrfProtection = csrf();
app.use(flash());

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
}));
app.use(csrfProtection);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }

      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  next();
})


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.redirect('/500');
})

mongoose
  .connect(
    mongodbURI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  )
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
