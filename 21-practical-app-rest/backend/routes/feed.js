const express = require('express');

const { body } = require('express-validator');

const feedController = require('../controllers/feed');

const router = express.Router();

router.get('/posts', feedController.getPosts);

router.post(
  '/post',
  [
    body('title')
      .isLength({ min: 5 })
      .trim(),
    body('content')
      .isLength({ min: 5 })
      .trim(),
  ],
  feedController.createPost
);

router.get('/post/:postId', feedController.getPostById);

router.put(
  '/post/:postId',
  [
    body('title')
      .isLength({ min: 5 })
      .trim(),
    body('content')
      .isLength({ min: 5 })
      .trim(),
  ],
  feedController.updatePost
);

router.delete('/post/:postId', feedController.deletePost)

module.exports = router;