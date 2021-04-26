const Product = require('../models/product');
// const Cart = require('../models/cart-item');
// const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product
    .fetchAll()
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

  Product.findById(productId)
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
    .fetchAll()
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
  req.user
    .getCart()
    .then(cartProducts => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts,
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  
  Product
    .findById(productId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.deleteCartItem = (req, res) => {
  const productId = req.body.productId;

  req.user
    .deleteCartItem(productId)
    .then((product) => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
  let fetchedCart;

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      console.log(products);
      return req.user.createOrder().then(order => {
        order.addProducts(
          products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity }
            return product;
          })
        );
      });
    })
    .then(() => {
      // clean up the cart
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {

  // fetch related orders with products
  req.user
  .getOrders({ include: ['products'] })
  .then(orders => {
    res.render('shop/orders', {
      orders,
      path: '/orders',
      pageTitle: 'Your Orders'
    });
  })
  .catch(err => console.error(err));
};

exports.getCheckout = (req, res, next) => {

  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
