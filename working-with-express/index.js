const express = require('express');

const app = express();

app.use('/', (req, res, next) => {
  console.log('This always runs');
  next();
});

app.use('/add-product', (req, res, next) => {
  res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
});

app.use('/product', (req, res, next) => {
  res.send('<h1>Hello world form express</h1>');
});

app.use('/', (req, res, next) => {
  res.send('<h1>Hello world form express</h1>');
});

app.listen(3000);
