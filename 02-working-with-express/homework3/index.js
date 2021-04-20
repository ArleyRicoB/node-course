const express = require('express');
const path = require('path');

app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/users', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'views', 'users.html'));
})

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
})

app.listen(3000);
