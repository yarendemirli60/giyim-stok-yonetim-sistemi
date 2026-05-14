const productList = document.getElementById("productList");

const totalProducts = document.getElementById("totalProducts");
const lowStockProducts = document.getElementById("lowStockProducts");
const outOfStockProducts = document.getElementById("outOfStockProducts");
const totalStockValue = document.getElementById("totalStockValue");

const toast = document.getElementById("toast");

function getStockStatus(product) {
  const stock = Number(product.stock);
  const minStock = Number(product.minStock);

  if (stock === 0) {
    return {
      text: "Stokta Yok",
      className: "out",
    };
  }

  if (stock <= minStock) {
    return {
      text: "Düşük Stok",
      className: "low",
    };
  }

  return {
    text: "Stokta Var",
    className: "normal",
  };
}

function renderProducts(products) {
  productList.innerHTML = "";

  if (products.length === 0) {
    productList.innerHTML = `
      <tr>
        <td colspan="10">
          Gösterilecek ürün bulunamadı.
        </td>
      </tr>
    `;

    return;
  }

  products.forEach((product) => {
    const status = getStockStatus(product);

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.size}</td>
      <td>${product.color}</td>
      <td>${product.price} ₺</td>
      <td>${product.stock}</td>
      <td>
        <span class="badge ${status.className}">
          ${status.text}
        </span>
      </td>

      <td>
        <div class="actions">

          <button
            class="edit-btn"
            onclick="editProduct(${product.id})"
          >
            Güncelle
          </button>

          <button
            class="delete-btn"
            onclick="removeProduct(${product.id})"
          >
            Sil
          </button>

        </div>
      </td>
    `;

    productList.appendChild(row);
  });
}

function updateStats(products) {
  const total = products.length;

  const lowStock = products.filter((product) => {
    return (
      Number(product.stock) > 0 &&
      Number(product.stock) <= Number(product.minStock)
    );
  }).length;

  const outOfStock = products.filter((product) => {
    return Number(product.stock) === 0;
  }).length;

  const totalStock = products.reduce((sum, product) => {
    return sum + Number(product.stock);
  }, 0);

  totalProducts.textContent = total;
  lowStockProducts.textContent = lowStock;
  outOfStockProducts.textContent = outOfStock;
  totalStockValue.textContent = totalStock;
}

function showToast(message, type = "success") {
  toast.textContent = message;

  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.className = "toast";
  }, 2500);
}