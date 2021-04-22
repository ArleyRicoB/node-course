const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product
    .findAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch((err) => {
      console.log(err);
    })
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  // Product.findAll({ where: { id: productId }})
  Product.findByPk(productId)
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products'
      })
    })
    .catch((err) => console.log(err))
};

exports.getIndex = (req, res, next) => {
  Product
    .findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch((err) => {
      console.log(err);
    })
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll().then(([products]) => {
      const cartProducts = [];

      for(product of products) {
        const cartProductData = cart.products.find(prod => prod.id  === product.id);
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts,
      });
    }).catch(err => console.log(err));
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;

  Product.findByPk(productId)
    .then((product) => {
      Cart.addProduct(product.id, product.price);
    })
    .catch(err => console.log(err));

  res.redirect('/cart');
};

exports.deleteCartItem = (req, res) => {
  const productId = req.body.productId;

  Product.findByPk(productId)
    .then((product) => {
      Cart.deleteProduct(productId, product.price);
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
