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
function getProductById(req, res) {
  const id = req.params.id;

  productModel.getProductById(id, (err, product) => {
    if (err) {
      return res.status(500).json({
        message: "Ürün alınamadı",
        error: err.message,
      });
    }

    if (!product) {
      return res.status(404).json({
        message: "Ürün bulunamadı",
      });
    }

    res.status(200).json(product);
  });
}

function createProduct(req, res) {
  const product = req.body;

  productModel.createProduct(product, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Ürün eklenemedi",
        error: err.message,
      });
    }

    res.status(201).json({
      message: "Ürün başarıyla eklendi",
      result,
    });
  });
}

function updateProduct(req, res) {
  const id = req.params.id;
  const product = req.body;

  productModel.updateProduct(id, product, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Ürün güncellenemedi",
        error: err.message,
      });
    }

    res.status(200).json({
      message: "Ürün güncellendi",
      result,
    });
  });
}

function deleteProduct(req, res) {
  const id = req.params.id;

  productModel.deleteProduct(id, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Ürün silinemedi",
        error: err.message,
      });
    }

    res.status(200).json({
      message: "Ürün silindi",
      result,
    });
  });
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
