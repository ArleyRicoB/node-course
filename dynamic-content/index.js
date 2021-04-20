const path = require('path');
const expressHbs = require('express-handlebars');

const express = require('express');

const app = express();

// app.set('view engine', 'pug');
app.engine('hbs', expressHbs({
  layoutsDir: 'views/layouts/',
  defaultLayout: 'main-layout',
  extname: 'hbs'
}));
app.set('view engine', 'hbs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// we  dont need bodyParser.urlencoded()
app.use(express.urlencoded({ extended: false }));

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

// by default it puts the path '/'
app.use((req, res) => {
  res.status(404).render('404', { docTitle: 'Page not found' });
});

app.listen(3000);
