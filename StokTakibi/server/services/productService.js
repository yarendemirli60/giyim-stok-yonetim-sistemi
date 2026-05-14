const productModel = require("../models/productModel");

function getProducts(callback) {
  productModel.getAllProducts(callback);
}

function getProductById(id, callback) {
  productModel.getProductById(id, callback);
}

function createProduct(product, callback) {
  product.status = calculateStockStatus(product.stock, product.minStock);

  productModel.createProduct(product, callback);
}

function updateProduct(id, product, callback) {
  product.status = calculateStockStatus(product.stock, product.minStock);

  productModel.updateProduct(id, product, callback);
}

function deleteProduct(id, callback) {
  productModel.deleteProduct(id, callback);
}

function calculateStockStatus(stock, minStock) {
  const stockValue = Number(stock);
  const minStockValue = Number(minStock);

  if (stockValue === 0) {
    return "Stokta Yok";
  }

  if (stockValue <= minStockValue) {
    return "Düşük Stok";
  }

  return "Stokta Var";
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};