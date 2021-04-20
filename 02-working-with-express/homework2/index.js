const express = require('express');

app = express();

app.use('/', (req, res, next) => {
  console.log('first middleware');
  next();
})

app.use('/', (req, res, next) => {
  console.log('second middleware');
  next();
})

app.use('/users', (req, res, next) => {
  res.send('<ul><li>user 1</li><li>user 2</li></ul>');
})


app.use('/', (req, res, next) => {
  res.send('<h1>Welcome!</h1>');
})

app.listen(3000);
