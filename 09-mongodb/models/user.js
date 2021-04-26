const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id ? id : null;
  }

  save() {
    const db = getDb();

    return db
      .collection('users')
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(prod => {
      return prod.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity
      });
    }

    const updatedCart = { items: updatedCartItems };
    
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart} }
      );
  }

  getCart() {
  const db = getDb();

  const productIds = [];
  const quantities = {};

  this.cart.items.forEach((prod) => {
    let prodId = prod.productId;

    productIds.push(prodId);
    quantities[prodId] = prod.quantity;
  });

  return db
    .collection('products')
    .find({ _id: { $in: productIds } })
    .toArray()
    .then((products) => {
      return products.map((p) => {
        return { ...p, quantity: quantities[p._id] };
      });
    });
  }

  deleteCartItem(productId) {
    const db = getDb();
    const updatedCartItems = this.cart.items.filter(
      item => item.productId.toString() !== productId.toString()
    );

    return db
    .collection('users')
    .updateOne(
      { _id: this._id },
      { $set: { cart: { items: updatedCartItems } } });
  }

  static findById(id) {
    const db = getDb();

    return db
      .collection('users')
      .findOne({ _id: new ObjectId(id) })
      .then((user) => {
        console.log(user)
        return user;
      })
      .catch((error) => console(error));
  }
}

module.exports = User;