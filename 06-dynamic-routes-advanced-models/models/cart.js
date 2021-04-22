const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const newPath = path.join(
  rootDir,
  'data',
  'cart.json'
);

const getCartFromFile = cb => {
  fs.readFile(newPath, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(newPath, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        prod => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(newPath, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    getCartFromFile(cart => {
      const updatedCart = {...cart};

      const product = updatedCart.products.find(p => p.id === id);

      if (product) {
        const productQuantity = product.qty;
  
        updatedCart.products = updatedCart.products.filter(p => p.id != id);
        updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQuantity;
  
        fs.writeFile(newPath, JSON.stringify(updatedCart), err => {
          console.log(err);
        });
      }

      return console.log('Product is not in the cart');
    });
  }
};
