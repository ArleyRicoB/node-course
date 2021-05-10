const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');

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

  if( !req.file ) {
    const error = new Error('No image provided');
    error.statusCode(403);

    throw error;
  }

  const imageUrl = req.file.path.replace("\\" ,"/");
  const title = req.body.title;
  const content = req.body.content;

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

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const updatedTitle = req.body.title;
  const updatedContent = req.body.content;
  let imageUrl = req.body.image;

  console.log('here', imageUrl);

  if (req.file) {
    imageUrl = req.file.path.replace("\\" ,"/");;
  }

  if (!imageUrl) {
    const error = new Error('Image no picked.');
    error.statusCode = 403;
    throw error;
  }

  Post
    .findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Post not found');
        error.statusCode = 404;
        throw error;
      }

      if (imageUrl && post.imageUrl && imageUrl !== post.imageUrl) {
        post.imageUrl = imageUrl;
        clearImage(post.imageUrl);
      }

      post.title = updatedTitle;
      post.content = updatedContent;

      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: 'Post updated successfully',
        post: result
      })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    })
}

exports.deletePost = (req, res , next) => {
  const postId = req.params.postId;

  Post
    .findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error('Post not found');
        error.statusCode = 404;
        throw error;
      }

      clearImage(post.imageUrl);

      return Post.findByIdAndDelete(postId);
    })
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'Post deleted.' })
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    })
}

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
}
