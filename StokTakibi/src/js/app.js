const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const stockFilter = document.getElementById("stockFilter");

const addProductForm = document.getElementById("addProductForm");

let products = [];
let editingProductId = null;

document.addEventListener("DOMContentLoaded", loadProducts);

searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
stockFilter.addEventListener("change", applyFilters);

addProductForm.addEventListener("submit", handleSubmitProduct);

async function loadProducts() {
  try {
    products = await getProducts();

    renderProducts(products);
    updateStats(products);
  } catch (error) {
    showToast("Ürünler yüklenirken hata oluştu", "error");
  }
}

function applyFilters() {
  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedStock = stockFilter.value;

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      product.brand.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "" || product.category === selectedCategory;

    const stock = Number(product.stock);
    const minStock = Number(product.minStock);

    let matchesStock = true;

    if (selectedStock === "normal") {
      matchesStock = stock > minStock;
    }

    if (selectedStock === "low") {
      matchesStock = stock > 0 && stock <= minStock;
    }

    if (selectedStock === "out") {
      matchesStock = stock === 0;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  renderProducts(filteredProducts);
}

function getFormData() {
  return {
    name: document.getElementById("addName").value,
    category: document.getElementById("addCategory").value,
    size: document.getElementById("addSize").value,
    color: document.getElementById("addColor").value,
    season: document.getElementById("addSeason").value,
    price: document.getElementById("addPrice").value,
    stock: document.getElementById("addStock").value,
    minStock: document.getElementById("addMinStock").value,
    status: "Stokta Var",
  };
}

async function handleSubmitProduct(event) {
  event.preventDefault();

  const product = getFormData();

  const error = validateProduct(product);

  if (error) {
    showToast(error, "error");
    return;
  }

  try {
    if (editingProductId) {
      await updateProduct(editingProductId, product);
      showToast("Ürün başarıyla güncellendi");
      editingProductId = null;
    } else {
      await createProduct(product);
      showToast("Ürün başarıyla eklendi");
    }

    addProductForm.reset();
    await loadProducts();
  } catch (error) {
    showToast("İşlem sırasında hata oluştu", "error");
  }
}

function editProduct(id) {
  const product = products.find((item) => item.id === id);

  if (!product) {
    showToast("Ürün bulunamadı", "error");
    return;
  }

  editingProductId = id;

  document.getElementById("addName").value = product.name;
  document.getElementById("addCategory").value = product.category;
  document.getElementById("addSize").value = product.size;
  document.getElementById("addColor").value = product.color;
  document.getElementById("addSeason").value = product.season;
  document.getElementById("addPrice").value = product.price;
  document.getElementById("addStock").value = product.stock;
  document.getElementById("addMinStock").value = product.minStock;

  showToast(`ID ${id} olan ürün güncelleme için seçildi`);
}

async function removeProduct(id) {
  const confirmDelete = confirm("Bu ürünü silmek istediğinize emin misiniz?");

  if (!confirmDelete) {
    return;
  }

  try {
    await deleteProduct(id);
    showToast("Ürün başarıyla silindi");
    await loadProducts();
  } catch (error) {
    showToast("Ürün silinirken hata oluştu", "error");
  }
}

window.editProduct = editProduct;
window.removeProduct = removeProduct;