const products = [];

exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
    docTitle: "Add product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  res.render("shop", {
    products,
    docTitle: "Shop",
    path: "/",
  });
};
