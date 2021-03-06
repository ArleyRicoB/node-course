const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  console.log('user', req.user.id);

  req.user
    .createProduct({
      title,
      imageUrl,
      price,
      description,
      user: req.user.id,
    })
    .then((result) => res.redirect('/admin/products'))
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }

  const productId = req.params.id;

  req.user
    .getProducts({ where: { id: productId }})
    .then(products => {
      const product = products[0];
  // Product
  //   .findByPk(productId)
  //   .then((product) => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
      });
    })
    .catch(err => console.log(err))
};

exports.deleteProduct = (req, res) => {
  const id = req.body.id;

  Product
    .findByPk(id)
    .then(product => {
      return product.destroy();
    })
    .then(result => res.redirect('/admin/products'))
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;

  Product
    .findByPk(id)
    .then(product => {
      if (product) {
        product.title = title;
        product.price = price;
        product.description = description;
        product.imageUrl = imageUrl;

        return product.save();
      }
    })
    .then(result => res.redirect('/admin/products'))
    .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
  // Product
    // .findAll()
  req.user
    .getProducts()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};
