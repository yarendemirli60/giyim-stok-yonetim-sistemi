const authService = require("../services/authService");

function register(req, res) {
  const user = req.body;

  authService.registerUser(user, (err, result) => {
    if (err) {
      return res.status(400).json({
        message: err.message || "Kayıt başarısız",
      });
    }

    res.status(201).json({
      message: "Kullanıcı başarıyla oluşturuldu",
      result,
    });
  });
}

function login(req, res) {
  const { email, password } = req.body;

  authService.loginUser(email, password, (err, user) => {
    if (err) {
      return res.status(401).json({
        message: err.message || "Giriş başarısız",
      });
    }

    res.status(200).json({
      message: "Giriş başarılı",
      user,
    });
  });
}

function getUsers(req, res) {
  authService.getUsers((err, users) => {
    if (err) {
      return res.status(500).json({
        message: "Kullanıcılar alınamadı",
        error: err.message,
      });
    }

    res.status(200).json(users);
  });
}
module.exports = {
  register,
  login,
  getUsers,
};