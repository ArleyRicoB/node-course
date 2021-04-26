const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
  constructor(title, imageUrl, price, description, id, userId) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOperation;

    if (this._id) {
      dbOperation = db
      .collection('products')
      .updateOne({ _id: this._id }, {$set: this})
    } else {
      dbOperation = db
        .collection('products')
        .insertOne(this)
    }

    return dbOperation
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  }

  static findById(id) {
    const db = getDb();

    return db
      .collection('products')
      .find({ _id: mongodb.ObjectId(id) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((error) => console(error));
  }

  static deleteById(id) {
    const db = getDb();

    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(id) })
      .then((result) => console.log(result))
      .catch((error) => console(error));
  }

  static fetchAll() {
    const db = getDb();

    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        console.log(products);
        return products;
      })
      .catch((error) => console.log(error));
  }
}

module.exports = Product;
