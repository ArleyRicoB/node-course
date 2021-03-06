const express = require('express');
const { check, body } = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', [
  body('title').isString().isLength({ min: 3 }),
  body('imageUrl').isURL(),
  body('price').isFloat(),
  body('description').isLength({ min: 5, max: 200 }),
], isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', [
  body('title').isString().isLength({ min: 3 }),
  body('imageUrl').isURL(),
  body('price').isFloat(),
  body('description').isLength({ min: 5, max: 200 }),
], isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
