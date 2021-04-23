const getDb = require('../util/database').getDb;

class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    const db = getDb();

    return db
      .collection('products')
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
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
