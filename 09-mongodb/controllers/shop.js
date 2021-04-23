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
    .then(cart => {
      return cart.getProducts();
    })
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
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      // especial funcition created by sequalize,
      // is created under the connection between Cart and Products
      return cart.getProducts({ where: { id: productId }})
    })
    .then(products => {
      let product

      if (products.length > 0) {
        product = products[0];
      }

      // Add a product to an existing product
      if (product) {
        // when we have a product, we can access to the cartItem as property
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;

        // returns the product found in the "Cart table";
        return product;
      }

      // Add a new product
      // returns the product found in Products Table
      return Product.findByPk(productId)
    })
    .then(data => {
      return fetchedCart.addProduct(data, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.deleteCartItem = (req, res) => {
  const productId = req.body.productId;

  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: productId }})
    })
    .then(products => {
      const product = products[0];
      // cartItem: magic field that exist in between table
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));

  Product.findByPk(productId)
    .then((product) => {
      Cart.deleteProduct(productId, product.price);
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
