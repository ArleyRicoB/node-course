const { validationResult } = require('express-validator');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  Post
    .find()
    .then(posts => {
      res.status(200).json({
        message: 'Fetched posts successfully',
        posts
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(error);
    });
}

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 403;

    throw error; // cancel the process and go to NEXT function
  }

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path.replace("\\" ,"/");

  // Create post in db
  const post = new Post({
    title,
    content,
    imageUrl,
    creator: { name: 'Pedro' },
  })

  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'Post created successfully',
        post: result
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(error);
    })
}

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 403;

    throw error; // cancel the process and go to NEXT function
  }

  const postId = req.body.postId;
  const updatedTitle = req.body.title;
  const updatedContent = req.body.content;
  const image = req.file;

  Post
    .findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Post not found');
        error.statusCode = 404;

        throw error;
      }

      post.title = updatedTitle;
      post.content = updatedContent;

      if (image) {
        fileHelper.deleteFile(product.imageUrl);
        post.imageUrl = image.path.replace("\\" ,"/");
      }

      return post
        .save()
        .then(() => {
          res.status(201).json({
            message: 'Post updated successfully',
            post: result
          })
        })
        .catch((e) => {
          const error = new Error('Post not found');
          err.statusCode = 409;

          throw error;
        });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(error);
    })
}

exports.getPostById = (req, res, next) => {
  const postId = req.params?.postId;

  Post
    .findById(postId)
    .then(post => {
      if (!post) {
        const error = new Error('Couldn\'t find the post.')
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({ message: 'Post fetched.', post })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(error);
    });
}
