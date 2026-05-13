const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");

const openFormBtn = document.getElementById("openFormBtn");
const closeFormBtn = document.getElementById("closeFormBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const formModal = document.getElementById("formModal");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const stockFilter = document.getElementById("stockFilter");

const totalProducts = document.getElementById("totalProducts");
const lowStockProducts = document.getElementById("lowStockProducts");
const outOfStockProducts = document.getElementById("outOfStockProducts");
const totalStockValue = document.getElementById("totalStockValue");

let products = [
  {
    id: 1,
    name: "Oversize Siyah Hoodie",
    category: "Üst Giyim",
    size: "M",
    color: "Siyah",
    stock: 12,
    price: 899
  },
  {
    id: 2,
    name: "Mom Jean Pantolon",
    category: "Alt Giyim",
    size: "38",
    color: "Mavi",
    stock: 4,
    price: 1199
  },
  {
    id: 3,
    name: "Kaşe Kaban",
    category: "Dış Giyim",
    size: "L",
    color: "Bej",
    stock: 0,
    price: 2499
  }
];

let editingProductId = null;

function getStockStatus(stock) {
  if (stock === 0) {
    return {
      text: "Stokta Yok",
      className: "out"
    };
  }

  if (stock <= 5) {
    return {
      text: "Kritik Stok",
      className: "low"
    };
  }

  return {
    text: "Stokta Var",
    className: "normal"
  };
}

function renderProducts() {
  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedStock = stockFilter.value;

  let filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      product.color.toLowerCase().includes(searchText) ||
      product.size.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    const status = getStockStatus(product.stock).className;
    const matchesStock =
      selectedStock === "all" || status === selectedStock;

    return matchesSearch && matchesCategory && matchesStock;
  });

  productList.innerHTML = "";

  if (filteredProducts.length === 0) {
    productList.innerHTML = `
      <div class="empty">
        Aradığınız kritere uygun ürün bulunamadı.
      </div>
    `;
    return;
  }

  filteredProducts.forEach((product) => {
    const status = getStockStatus(product.stock);

    const productItem = document.createElement("div");
    productItem.className = "product-item";

    productItem.innerHTML = `
      <div class="product-name">
        <strong>${product.name}</strong>
        <span>${product.category}</span>
      </div>

      <div>
        <strong>Beden:</strong> ${product.size}
      </div>

      <div>
        <strong>Renk:</strong> ${product.color}
      </div>

      <div>
        <strong>Stok:</strong> ${product.stock}
      </div>

      <div>
        <strong>₺${product.price}</strong>
      </div>

      <div>
        <span class="badge ${status.className}">${status.text}</span>
      </div>

      <div class="actions">
        <button class="edit-btn" onclick="editProduct(${product.id})">Düzenle</button>
        <button class="delete-btn" onclick="deleteProduct(${product.id})">Sil</button>
      </div>
    `;

    productList.appendChild(productItem);
  });
}

function updateStats() {
  totalProducts.textContent = products.length;

  lowStockProducts.textContent = products.filter((product) => {
    return product.stock > 0 && product.stock <= 5;
  }).length;

  outOfStockProducts.textContent = products.filter((product) => {
    return product.stock === 0;
  }).length;

  const totalValue = products.reduce((total, product) => {
    return total + product.stock * product.price;
  }, 0);

  totalStockValue.textContent = `₺${totalValue.toLocaleString("tr-TR")}`;
}

function openModal() {
  formModal.classList.add("show");
}

function closeModal() {
  formModal.classList.remove("show");
  productForm.reset();
  editingProductId = null;
  formTitle.textContent = "Yeni Ürün Ekle";
  submitBtn.textContent = "Ürünü Kaydet";
}

openFormBtn.addEventListener("click", () => {
  openModal();
});

closeFormBtn.addEventListener("click", () => {
  closeModal();
});

cancelEditBtn.addEventListener("click", () => {
  closeModal();
});

productForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("productName").value.trim();
  const category = document.getElementById("productCategory").value;
  const size = document.getElementById("productSize").value.trim();
  const color = document.getElementById("productColor").value.trim();
  const stock = Number(document.getElementById("productStock").value);
  const price = Number(document.getElementById("productPrice").value);

  if (!name || !category || !size || !color || stock < 0 || price < 0) {
    alert("Lütfen tüm alanları doğru şekilde doldurun.");
    return;
  }

  if (editingProductId === null) {
    createProduct(name, category, size, color, stock, price);
  } else {
    updateProduct(editingProductId, name, category, size, color, stock, price);
  }

  closeModal();
  renderProducts();
  updateStats();
});

function createProduct(name, category, size, color, stock, price) {
  const newProduct = {
    id: Date.now(),
    name,
    category,
    size,
    color,
    stock,
    price
  };

  products.push(newProduct);
}

function editProduct(id) {
  const product = products.find((item) => item.id === id);

  if (!product) return;

  editingProductId = id;

  document.getElementById("productName").value = product.name;
  document.getElementById("productCategory").value = product.category;
  document.getElementById("productSize").value = product.size;
  document.getElementById("productColor").value = product.color;
  document.getElementById("productStock").value = product.stock;
  document.getElementById("productPrice").value = product.price;

  formTitle.textContent = "Ürünü Düzenle";
  submitBtn.textContent = "Değişiklikleri Kaydet";

  openModal();
}

function updateProduct(id, name, category, size, color, stock, price) {
  products = products.map((product) => {
    if (product.id === id) {
      return {
        id,
        name,
        category,
        size,
        color,
        stock,
        price
      };
    }

    return product;
  });
}

function deleteProduct(id) {
  const confirmDelete = confirm("Bu ürünü silmek istediğine emin misin?");

  if (!confirmDelete) return;

  products = products.filter((product) => product.id !== id);

  renderProducts();
  updateStats();
}

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
stockFilter.addEventListener("change", renderProducts);

renderProducts();
updateStats();