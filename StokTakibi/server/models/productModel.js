const db = require("../config/db"); 

function getAllProducts(callback) { 
 db.query("SELECT * FROM products ORDER BY id DESC", (err, rows) => 
{ 
callback(err, rows);
 });
 } 

 function createProduct(product, callback) {
  const sql = `
    INSERT INTO products
    (name, category, brand, size, color, season, status, price, stock, minStock)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    product.name,
    product.category,
    product.brand,
    product.size,
    product.color,
    product.season,
    product.status,
    product.price,
    product.stock,
    product.minStock,
  ];

  db.query(sql, values, (err, result) => {
    callback(err, result);
  });
}

function updateProduct(id, product, callback) {
  const sql = `
    UPDATE products
    SET
      name = ?,
      category = ?,
      brand = ?,
      size = ?,
      color = ?,
      season = ?,
      status = ?,
      price = ?,
      stock = ?,
      minStock = ?
    WHERE id = ?
  `;

  const values = [
    product.name,
    product.category,
    product.brand,
    product.size,
    product.color,
    product.season,
    product.status,
    product.price,
    product.stock,
    product.minStock,
    id,
  ];

  db.query(sql, values, (err, result) => {
    callback(err, result);
  });
}

function deleteProduct(id, callback) {
  db.query(
    "DELETE FROM products WHERE id = ?",
    [id],
    (err, result) => {
      callback(err, result);
    }
  );
}

module.exports = { 
 getAllProducts, 
 createProduct,
 updateProduct,
 deleteProduct,
};