const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

// important: router.get its just for the EXACT path while router.uses is for ALL paths
router.get('/', (req, res, next) => {
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;
