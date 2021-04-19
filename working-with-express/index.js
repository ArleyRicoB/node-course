const path = require('path');

const express = require('express');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// we  dont need bodyParser.urlencoded()
app.use(express.urlencoded({ extended: false }));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// by default it puts the path '/'
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);
