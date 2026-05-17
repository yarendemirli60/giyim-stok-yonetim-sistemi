import {
  loginUser,
  registerUser,
  getCurrentUser,
  logout,
} from "./auth.js";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getUsers,
} from "./api.js";

const app = document.getElementById("app");

function startApp() {
  const user = getCurrentUser();

  if (user) {
    renderDashboard(user);
  } else {
    renderAuthPage();
  }
}

function renderAuthPage() {
  app.innerHTML = `
    <div class="auth-container">
      <div class="auth-card">
        <h1>Meral Giyim</h1>

        <div class="auth-tabs">
          <button id="showLogin" class="active-tab">Giriş Yap</button>
          <button id="showRegister">Kayıt Ol</button>
        </div>

        <form id="loginForm" class="auth-form">
          <input type="email" id="loginEmail" placeholder="Email" required />
          <input type="password" id="loginPassword" placeholder="Şifre" required />
          <button type="submit">Giriş Yap</button>
        </form>

        <form id="registerForm" class="auth-form hidden">
          <input type="text" id="registerName" placeholder="Ad Soyad" required />
          <input type="email" id="registerEmail" placeholder="Email" required />
          <input type="password" id="registerPassword" placeholder="Şifre" required />

          <select id="registerRole">
            <option value="personel">Personel</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">Kayıt Ol</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById("showLogin").addEventListener("click", () => {
    document.getElementById("loginForm").classList.remove("hidden");
    document.getElementById("registerForm").classList.add("hidden");
    document.getElementById("showLogin").classList.add("active-tab");
    document.getElementById("showRegister").classList.remove("active-tab");
  });

  document.getElementById("showRegister").addEventListener("click", () => {
    document.getElementById("registerForm").classList.remove("hidden");
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("showRegister").classList.add("active-tab");
    document.getElementById("showLogin").classList.remove("active-tab");
  });

  document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const user = await loginUser(email, password);

    if (user) {
      renderDashboard(user);
    }
  });

  document.getElementById("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const userData = {
      fullName: document.getElementById("registerName").value,
      email: document.getElementById("registerEmail").value,
      password: document.getElementById("registerPassword").value,
      role: document.getElementById("registerRole").value,
    };

    await registerUser(userData);
  });
}

function renderDashboard(user) {
  app.innerHTML = `
    <div class="erp-layout">
      <header class="erp-topbar">
        <div class="brand-name">Meral Giyim</div>
      </header>
  
      <div class="erp-body">
        <aside class="erp-sidebar">
          <div class="menu-item active" data-page="home">
            <i class="fa-solid fa-magnifying-glass"></i>
            <span>Menü Arama</span>
            <b>‹</b>
          </div>

          <div class="search-box hidden" id="menuSearchBox">
            <input type="text" placeholder="Ara..." />
          </div>

          <div class="menu-item" data-page="products">
            <i class="fa-solid fa-shirt"></i>
            <span>Ürünler</span>
            <b>‹</b>
          </div>

          <div class="menu-item" data-page="productForm">
            <i class="fa-solid fa-pen-to-square"></i>
            <span>Ürün Ekle / Güncelle</span>
            <b>‹</b>
          </div>

          <div class="menu-item" data-page="stock">
            <i class="fa-solid fa-boxes-stacked"></i>
            <span>Stok Durumu</span>
            <b>‹</b>
          </div>

          ${
            user.role === "admin"
              ? `
                <div class="menu-item" data-page="users">
                  <i class="fa-solid fa-users-gear"></i>
                  <span>Kullanıcı Yönetimi</span>
                  <b>‹</b>
                </div>
              `
              : ""
          }

          <button id="logoutBtn" class="erp-logout">Çıkış Yap</button>
        </aside>

        <main class="erp-main">
          <button class="collapse-btn">‹</button>
          <section id="pageContent" class="erp-content"></section>
        </main>
      </div>
    </div>
  `;

  document.getElementById("logoutBtn").addEventListener("click", logout);

  const menuItems = document.querySelectorAll(".menu-item");
  const pageContent = document.getElementById("pageContent");
  const searchBox = document.getElementById("menuSearchBox");

  function setActiveMenu(selectedItem) {
    menuItems.forEach((item) => item.classList.remove("active"));
    selectedItem.classList.add("active");
  }

  function closeSearchBox() {
    searchBox.classList.add("hidden");
  }

  function renderHome() {
    pageContent.innerHTML = `
      <div class="home-header">
        <div class="home-tab">
          <i class="fa-solid fa-house"></i>
          <span>Ana Sayfa</span>
        </div>

        <div class="home-line"></div>
      </div>

      <div class="home-socials">
        <div class="social-box">
          <i class="fa-brands fa-instagram"></i>
        </div>
      </div>
    `;
  }

  async function renderProductsPage() {
    pageContent.innerHTML = `
      <div class="product-page">
        <div class="breadcrumb">
          <span class="go-home"><i class="fa-solid fa-house"></i> Ana Sayfa</span>
          <span>Ürünler</span>
        </div>

        <div class="filter-panel">
          <div class="filter-grid">
            <div class="filter-group">
              <label>KATEGORİ</label>
              <input type="text" id="categoryFilter" />
            </div>

            <div class="filter-group">
              <label>SEZON</label>
              <input type="text" id="seasonFilter" />
            </div>

            <div class="filter-group">
              <label>RENK</label>
              <input type="text" id="colorFilter" />
            </div>
          </div>

          <div class="filter-actions">
            <button id="listProductsBtn" class="list-btn">
              <i class="fa-solid fa-list"></i>
              Listele
            </button>

            <button id="clearFiltersBtn" class="clear-btn">
              <i class="fa-solid fa-xmark"></i>
              Filtreleri Sıfırla
            </button>
          </div>
        </div>

        <div id="productsTableArea" class="products-table-area">
          Ürünler yükleniyor...
        </div>
      </div>
    `;
     document.querySelector(".go-home").addEventListener("click", () => {
  renderHome();
});
    try {
      const products = await getProducts();

      renderProductsTable(products);

      document.getElementById("listProductsBtn").addEventListener("click", () => {
        const category = document.getElementById("categoryFilter").value.toLowerCase();
        const season = document.getElementById("seasonFilter").value.toLowerCase();
        const color = document.getElementById("colorFilter").value.toLowerCase();

        const filteredProducts = products.filter((product) => {
          const categoryMatch =
            category === "" ||
            String(product.category || "").toLowerCase().includes(category);

          const seasonMatch =
            season === "" ||
            String(product.season || "").toLowerCase().includes(season);

          const colorMatch =
            color === "" ||
            String(product.color || "").toLowerCase().includes(color);

          return categoryMatch && seasonMatch && colorMatch;
        });

        renderProductsTable(filteredProducts);
      });

      document.getElementById("clearFiltersBtn").addEventListener("click", () => {
        document.getElementById("categoryFilter").value = "";
        document.getElementById("seasonFilter").value = "";
        document.getElementById("colorFilter").value = "";

        renderProductsTable(products);
      });
    } catch (error) {
      document.getElementById("productsTableArea").innerHTML = `
        <p class="empty-text">Ürünler yüklenirken hata oluştu.</p>
      `;
    }
  }

  function renderProductsTable(products) {
    const tableArea = document.getElementById("productsTableArea");

    if (!products || products.length === 0) {
      tableArea.innerHTML = `<p class="empty-text">Ürün bulunamadı.</p>`;
      return;
    }

    tableArea.innerHTML = `
      <table class="products-table">
        <thead>
          <tr>
            <th>Ürün ID</th>
            <th>Ürün Adı</th>
            <th>Kategori</th>
            <th>Beden</th>
            <th>Renk</th>
            <th>Sezon</th>
            <th>Stok</th>
            <th>Min. Stok</th>
            <th>Fiyat</th>
          </tr>
        </thead>

        <tbody>
          ${products
            .map(
              (product) => `
                <tr>
                  <td>#${product.id}</td>
                  <td>${product.name}</td>
                  <td>${product.category}</td>
                  <td>${product.size || "-"}</td>
                  <td>${product.color || "-"}</td>
                  <td>${product.season || "-"}</td>
                  <td>${product.stock}</td>
                  <td>${product.minStock}</td>
                  <td>${product.price} TL</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  async function renderProductFormPage() {
    pageContent.innerHTML = `
      <div class="product-form-page">
        <div class="breadcrumb">
     <span class="go-home">
     <i class="fa-solid fa-house"></i>
      Ana Sayfa
     </span>

      <span>
      <i class="fa-solid fa-pen-to-square"></i>
      Ürün Ekle / Güncelle
     </span>
     </div>

        <div class="product-form-grid">
          <form id="productForm" class="product-form-card">
            <input type="hidden" id="editingProductId" />

            <div class="form-row">
              <div class="form-group">
                <label>Ürün Adı</label>
                <input type="text" id="productName" required />
              </div>

              <div class="form-group">
                <label>Kategori</label>
                <input type="text" id="productCategory" required />
              </div>

              <div class="form-group">
                <label>Beden</label>
                <input type="text" id="productSize" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Renk</label>
                <input type="text" id="productColor" />
              </div>

              <div class="form-group">
                <label>Sezon</label>
                <input type="text" id="productSeason" />
              </div>

              <div class="form-group">
                <label>Fiyat</label>
                <input type="number" id="productPrice" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Stok</label>
                <input type="number" id="productStock" required />
              </div>

              <div class="form-group">
                <label>Minimum Stok</label>
                <input type="number" id="productMinStock" value="5" />
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="save-btn">
                <i class="fa-solid fa-floppy-disk"></i>
                Kaydet
              </button>

              <button type="button" id="clearProductForm" class="reset-btn">
                <i class="fa-solid fa-eraser"></i>
                Temizle
              </button>
            </div>
          </form>

          <div class="info-card">
            <h3>İşlem Bilgisi</h3>
            <p>Güncellemek ve silmek için aşağıdaki tablodan bir ürünü seçin.</p>
            <p>${
              user.role === "admin"
                ? "Admin olarak ürün silebilirsiniz."
                : "Personel olarak silme yetkiniz yoktur."
            }</p>
          </div>
        </div>

        <div id="formProductsTable" class="products-table-area">
          Ürünler yükleniyor...
        </div>
      </div>
    `;
      document.querySelector(".go-home").addEventListener("click", () => {
    renderHome();
    });

    const productForm = document.getElementById("productForm");
    const clearButton = document.getElementById("clearProductForm");

    async function loadFormProducts() {
      const products = await getProducts();
      renderFormProductsTable(products);
    }

    function getProductFormData() {
      return {
        name: document.getElementById("productName").value,
        category: document.getElementById("productCategory").value,
        size: document.getElementById("productSize").value,
        color: document.getElementById("productColor").value,
        season: document.getElementById("productSeason").value,
        price: document.getElementById("productPrice").value,
        stock: document.getElementById("productStock").value,
        minStock: document.getElementById("productMinStock").value,
        status: "Stokta Var",
      };
    }

    function clearForm() {
      productForm.reset();
      document.getElementById("editingProductId").value = "";
      document.querySelector(".save-btn").innerHTML =
        '<i class="fa-solid fa-floppy-disk"></i> Kaydet';
    }

    productForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const editingId = document.getElementById("editingProductId").value;
      const product = getProductFormData();

      if (editingId) {
        await updateProduct(editingId, product);
        alert("Ürün başarıyla güncellendi");
      } else {
        await createProduct(product);
        alert("Ürün başarıyla eklendi");
      }

      clearForm();
      await loadFormProducts();
    });

    clearButton.addEventListener("click", clearForm);

    window.selectProductForEdit = function (id) {
      getProducts().then((products) => {
        const product = products.find((item) => item.id === id);

        if (!product) return;

        document.getElementById("editingProductId").value = product.id;
        document.getElementById("productName").value = product.name;
        document.getElementById("productCategory").value = product.category;
        document.getElementById("productSize").value = product.size || "";
        document.getElementById("productColor").value = product.color || "";
        document.getElementById("productSeason").value = product.season || "";
        document.getElementById("productPrice").value = product.price;
        document.getElementById("productStock").value = product.stock;
        document.getElementById("productMinStock").value = product.minStock;

        document.querySelector(".save-btn").innerHTML =
          '<i class="fa-solid fa-pen-to-square"></i> Güncelle';
      });
    };

    window.removeProductFromForm = async function (id) {
      if (user.role !== "admin") {
        alert("Bu işlem için admin yetkisi gerekir.");
        return;
      }

      const confirmDelete = confirm("Bu ürünü silmek istediğinize emin misiniz?");

      if (!confirmDelete) return;

      await deleteProduct(id);
      alert("Ürün silindi");
      await loadFormProducts();
    };

    function renderFormProductsTable(products) {
      const tableArea = document.getElementById("formProductsTable");

      if (!products || products.length === 0) {
        tableArea.innerHTML = `<p class="empty-text">Henüz ürün yok.</p>`;
        return;
      }

      tableArea.innerHTML = `
        <table class="products-table">
          <thead>
            <tr>
              <th>Ürün ID</th>
              <th>Ürün Adı</th>
              <th>Kategori</th>
              <th>Renk</th>
              <th>Beden</th>
              <th>Stok</th>
              <th>Fiyat</th>
              <th>İşlem</th>
            </tr>
          </thead>

          <tbody>
            ${products
              .map(
                (product) => `
                  <tr>
                    <td>#${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.color || "-"}</td>
                    <td>${product.size || "-"}</td>
                    <td>${product.stock}</td>
                    <td>${product.price} TL</td>
                    <td>
                      <button class="edit-btn" onclick="selectProductForEdit(${product.id})">
                        Düzenle
                      </button>

                      ${
                        user.role === "admin"
                          ? `
                            <button class="delete-btn" onclick="removeProductFromForm(${product.id})">
                              Sil
                            </button>
                          `
                          : ""
                      }
                    </td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      `;
    }

    await loadFormProducts();
  }

  async function renderStockPage() {
  pageContent.innerHTML = `
    <div class="stock-page">

      <div class="breadcrumb">
        <span class="go-home">
          <i class="fa-solid fa-house"></i>
          Ana Sayfa
        </span>

        <span>
          <i class="fa-solid fa-warehouse"></i>
          Stok Durumu
        </span>
      </div>

      <div class="stock-modern-cards">
        <div class="stock-modern-card blue">
          <div class="stock-icon">
            <i class="fa-solid fa-box"></i>
          </div>
          <div>
            <span>Toplam Ürün</span>
            <strong id="totalProductsText">0</strong>
            <p>Tüm ürün sayısı</p>
          </div>
        </div>

        <div class="stock-modern-card yellow">
          <div class="stock-icon">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>
          <div>
            <span>Düşük Stok</span>
            <strong id="lowStockText">0</strong>
            <p>Min. stok seviyesinde</p>
          </div>
        </div>

        <div class="stock-modern-card red">
          <div class="stock-icon">
            <i class="fa-solid fa-circle-xmark"></i>
          </div>
          <div>
            <span>Stokta Yok</span>
            <strong id="outStockText">0</strong>
            <p>Stok miktarı sıfır</p>
          </div>
        </div>
      </div>

      <div id="criticalAlertArea"></div>

      <div class="stock-modern-table">
        <div class="stock-table-top compact">
         <h3>Kritik Ürünler</h3> 
        </div>

        <div id="criticalStockArea">
          Kritik ürünler yükleniyor...
        </div>
      </div>

    </div>
  `;

  document.querySelector(".go-home").addEventListener("click", () => {
    renderHome();
  });

  try {
    const products = await getProducts();

    const totalProducts = products.length;

    const lowStockProducts = products.filter(
      (product) =>
        Number(product.stock) > 0 &&
        Number(product.stock) <= Number(product.minStock)
    );

    const outOfStockProducts = products.filter(
      (product) => Number(product.stock) === 0
    );

    document.getElementById("totalProductsText").textContent = totalProducts;
    document.getElementById("lowStockText").textContent = lowStockProducts.length;
    document.getElementById("outStockText").textContent = outOfStockProducts.length;

    const criticalProducts = [...lowStockProducts, ...outOfStockProducts];

    if (criticalProducts.length > 0) {
      document.getElementById("criticalAlertArea").innerHTML = `
        <div class="stock-modern-alert">
          <div class="alert-icon">
            <i class="fa-regular fa-bell"></i>
          </div>

          <div>
            <h4>Kritik stok bildirimi</h4>
            <p>${criticalProducts.length} ürün kontrol edilmelidir.</p>
          </div>
        </div>
      `;
    }

    renderCriticalStockTable(criticalProducts);
  } catch (error) {
    document.getElementById("criticalStockArea").innerHTML = `
      <p class="empty-text">Stok bilgileri yüklenirken hata oluştu.</p>
    `;
  }
}

function renderCriticalStockTable(products) {
  const criticalArea = document.getElementById("criticalStockArea");

  if (!products || products.length === 0) {
    criticalArea.innerHTML = `
      <p class="empty-text">
        Kritik stokta ürün bulunmuyor.
      </p>
    `;
    return;
  }

  criticalArea.innerHTML = `
    <table class="stock-modern-data-table">
      <thead>
        <tr>
          <th>Ürün ID</th>
          <th>Ürün Adı</th>
          <th>Kategori</th>
          <th>Stok</th>
          <th>Min. Stok</th>
          <th>Durum</th>
        </tr>
      </thead>

      <tbody>
        ${products
          .map((product) => {
            const stock = Number(product.stock);
            const minStock = Number(product.minStock);

            const status =
              stock === 0
                ? `<span class="stock-status danger">Stokta Yok</span>`
                : stock <= minStock
                ? `<span class="stock-status warning">Düşük Stok</span>`
                : `<span class="stock-status normal">Normal</span>`;

            return `
              <tr>
                <td>#${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.stock}</td>
                <td>${product.minStock}</td>
                <td>${status}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>

    <div class="stock-table-footer">
      <span>
        <i class="fa-solid fa-circle-info"></i>
        Gösterilen: ${products.length} ürün
      </span>
    </div>
  `;
}

  async function renderUsersPage() {
  pageContent.innerHTML = `
    <div class="users-page">
      <div class="breadcrumb">
        <span class="go-home">
          <i class="fa-solid fa-house"></i>
          Ana Sayfa
        </span>

        <span>
          <i class="fa-solid fa-users-gear"></i>
          Kullanıcı Yönetimi
        </span>
      </div>

      <div id="usersTableArea" class="users-table-area">
        Kullanıcılar yükleniyor...
      </div>
    </div>
  `;

  document.querySelector(".go-home").addEventListener("click", () => {
    renderHome();
  });

  try {
    const users = await getUsers();

    const totalUsers = users.length;
    const adminCount = users.filter((user) => user.role === "admin").length;
    const personelCount = users.filter((user) => user.role === "personel").length;

    
    renderUsersTable(users);
  } catch (error) {
    document.getElementById("usersTableArea").innerHTML = `
      <p class="empty-text">Kullanıcılar yüklenirken hata oluştu.</p>
    `;
  }
}

function renderUsersTable(users) {
  const usersTableArea = document.getElementById("usersTableArea");

  if (!users || users.length === 0) {
    usersTableArea.innerHTML = `<p class="empty-text">Kullanıcı bulunamadı.</p>`;
    return;
  }

  usersTableArea.innerHTML = `
    <table class="products-table">
      <thead>
        <tr>
          <th>Kullanıcı ID</th>
          <th>Ad Soyad</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Kayıt Tarihi</th>
        </tr>
      </thead>

      <tbody>
        ${users
          .map(
            (user) => `
              <tr>
                <td>#${user.id}</td>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>
                  <span class="role-badge ${user.role}">
                    ${user.role}
                  </span>
                </td>
                <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString("tr-TR") : "-"}</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}
  menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    setActiveMenu(item);

    const page = item.dataset.page;

    if (page === "home") {
      searchBox.classList.toggle("hidden");
      renderHome();
    }

    if (page === "products") {
      closeSearchBox();
      renderProductsPage();
    }

    if (page === "productForm") {
      closeSearchBox();
      renderProductFormPage();
    }

    if (page === "stock") {
      closeSearchBox();
      renderStockPage();
    }

    if (page === "users") {
      closeSearchBox();
      renderUsersPage();
    }
  });
});
   renderHome();
}
startApp();