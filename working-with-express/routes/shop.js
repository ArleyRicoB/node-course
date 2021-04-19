const express = require('express');
const path = require('path');

const router = express.Router();

// important: router.get its just for the EXACT path while router.uses is for ALL paths
router.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../', 'views', 'shop.html'));
});

module.exports = router;
