const API_URL = "http://localhost:3001/api/products";

async function getProducts() {
  const response = await fetch(API_URL);
  return response.json();
}

async function getProductById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  return response.json();
}

async function createProduct(product) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return response.json();
}

async function updateProduct(id, product) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return response.json();
}

async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  return response.json();
}