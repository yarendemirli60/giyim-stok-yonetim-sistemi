const userModel = require("../models/userModel");

function registerUser(user, callback) {
  userModel.getUserByEmail(user.email, (err, existingUser) => {
    if (err) {
      return callback(err);
    }

    if (existingUser) {
      return callback({
        message: "Bu email zaten kayıtlı",
      });
    }

    userModel.createUser(user, callback);
  });
}

function loginUser(email, password, callback) {
  userModel.getUserByEmail(email, (err, user) => {
    if (err) {
      return callback(err);
    }

    if (!user) {
      return callback({
        message: "Kullanıcı bulunamadı",
      });
    }

    if (user.password !== password) {
      return callback({
        message: "Şifre yanlış",
      });
    }

    callback(null, user);
  });
}
function getUsers(callback) {
  userModel.getAllUsers(callback);
}

module.exports = {
  registerUser,
  loginUser,
  getUsers,
};