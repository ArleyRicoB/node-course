const express = require("express");

const adminData = require("./admin");

const router = express.Router();

router.get("/", (req, res, next) => {
  const { products } = adminData;

  res.render("shop", {
    products,
    docTitle: "Shop",
    path: "/",
  });
});

module.exports = router;
