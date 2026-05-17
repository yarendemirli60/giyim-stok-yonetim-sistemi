const db = require("../config/db");

function createUser(user, callback) {
  const sql = `
    INSERT INTO users (fullName, email, password, role)
    VALUES (?, ?, ?, ?)
  `;

  const values = [
    user.fullName,
    user.email,
    user.password,
    user.role || "personel",
  ];

  db.query(sql, values, (err, result) => {
    callback(err, result);
  });
}

function getUserByEmail(email, callback) {
  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, rows) => {
    callback(err, rows[0]);
  });
}

function getAllUsers(callback) {
  const sql = "SELECT id, fullName, email, role, createdAt FROM users ORDER BY id DESC";

  db.query(sql, (err, rows) => {
    callback(err, rows);
  });
}

module.exports = {
  createUser,
  getUserByEmail,
  getAllUsers,
};