const db = require("../config/db"); 

function getAllProducts(callback) { 
 db.query("SELECT * FROM products ORDER BY id DESC", (err, rows) => 
{ 
callback(err, rows);
 });
 } 

 function getProductById(id, callback) {
  db.query(
    "SELECT * FROM products WHERE id = ?",
    [id],
    (err, rows) => {
      if (err) {
        return callback(err, null);
      }

      callback(null, rows[0]);
    }
  );
}

 function createProduct(product, callback) {
  const sql = `
    INSERT INTO products
    (name, category, size, color, season, status, price, stock, minStock)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    product.name,
    product.category,
    product.size,
    product.color,
    product.season,
    product.status,
    product.price,
    product.stock,
    product.minStock,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }

    callback(null, {
      id: result.insertId,
      ...product,
    });
  });
}


function updateProduct(id, product, callback) {
  const sql = `
    UPDATE products
    SET
      name = ?,
      category = ?,
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
    if (err) {
      return callback(err, null);
    }

    callback(null, result);
  });
}

function deleteProduct(id, callback) {
  db.query(
    "DELETE FROM products WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
      return callback(err, null);
    }

    callback(null, result);
  });
}


module.exports = { 
 getAllProducts, 
 createProduct,
 getProductById,
 updateProduct,
 deleteProduct,
};