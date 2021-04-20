const express = require('express');
const path = require('path');

const usersData = require('./routes/addUser');

const app = express();

app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(usersData.routes);

app.get('/', (req, res, next) => {
  res.render('index', { pageTitle: 'Principal', users: usersData.users });
})

app.listen(3000);
