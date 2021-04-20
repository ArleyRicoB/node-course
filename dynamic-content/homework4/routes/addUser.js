const express = require('express');

const routes = express.Router();

const users = [];

routes.get('/users', (req, res, next) => {
  res.render('users', { pageTitle: 'Users' });
})

routes.post("/users", (req, res) => {
  users.push({ name: req.body.user });
  res.redirect("/");
});

exports.routes = routes;
exports.users = users;
