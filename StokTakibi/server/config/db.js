const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Yaren253800",
  database: "stok_takibi",
});

db.connect((err) => {
  if (err) {
    console.log("MySQL bağlantı hatası:", err.message);
  } else {
    console.log("MySQL veritabanına bağlandı.");
  }
});

module.exports = db;