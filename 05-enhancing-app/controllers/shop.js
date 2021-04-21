const Product = require('../models/Product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products => {
    res.render("shop/product-list", {
      products,
      docTitle: "All Products",
      path: "/products",
    });
  }));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products => {
    res.render("shop/index", {
      products,
      docTitle: "Shop",
      path: "/",
    });
  }));
}

exports.getCart = (req, res, next) => {
  res.render("shop/cart", {
    docTitle: "Your Cart",
    path: "/cart",
  });
}

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    docTitle: "Your Orders",
    path: "/orders",
  });
}

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
  });
}
