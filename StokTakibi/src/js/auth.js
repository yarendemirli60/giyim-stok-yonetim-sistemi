const API_URL = "http://localhost:3001/api/auth";

async function registerUser(userData) {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    alert(data.message);

    return data;
  } catch (error) {
    console.error("Kayıt hatası:", error);
  }
}

async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Giriş başarılı");

      return data.user;
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Giriş hatası:", error);
  }
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function logout() {
  localStorage.removeItem("user");

  location.reload();
}

export {
  registerUser,
  loginUser,
  getCurrentUser,
  logout,
};