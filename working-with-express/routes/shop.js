const express = require('express');

const router = express.Router();

// important: router.get its just for the EXACT path while router.uses is for ALL paths
router.get('/', (req, res, next) => {
  res.send('<h1>Hello world form express</h1>');
});

module.exports = router;
