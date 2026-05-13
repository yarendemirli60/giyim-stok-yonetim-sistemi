const productModel = require("../models/productModel");

function getProducts(req, res) {
  productModel.getAllProducts((err, products) => {
    if (err) {
      return res.status(500).json({
        message: "Ürünler alınamadı",
        error: err.message,
      });
    }

    res.status(200).json(products);
  });
}

module.exports = {
  getProducts,
};