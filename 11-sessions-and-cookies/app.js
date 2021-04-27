const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);

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

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;

      next();
    })
    .catch(err => console.log(err));
});


app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    mongodbURI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Pedro',
          email: 'pedro@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
