const db = require("../config/db"); 

function getAllProducts(callback) { 
 db.query("SELECT * FROM products ORDER BY id DESC", (err, rows) => 
{ 
callback(err, rows);
 });
 } 
module.exports = { 
 getAllProducts, 
};