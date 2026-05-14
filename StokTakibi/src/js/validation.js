function validateProduct(product) {

  if (!product.name.trim()) {
    return "Ürün adı zorunludur";
  }

  if (!product.category.trim()) {
    return "Kategori seçmelisiniz";
  }

  if (!product.size.trim()) {
    return "Beden bilgisi zorunludur";
  }

  if (!product.color.trim()) {
    return "Renk bilgisi zorunludur";
  }

  if (!product.season.trim()) {
    return "Sezon bilgisi zorunludur";
  }

  if (product.price === "" || Number(product.price) <= 0) {
    return "Geçerli bir fiyat giriniz";
  }

  if (product.stock === "" || Number(product.stock) < 0) {
    return "Geçerli bir stok miktarı giriniz";
  }

  if (product.minStock === "" || Number(product.minStock) < 0) {
    return "Geçerli bir minimum stok değeri giriniz";
  }

  return null;
}

