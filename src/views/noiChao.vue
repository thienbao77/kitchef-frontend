<script setup>
import { ref, computed } from 'vue'

// 1. Dữ liệu sản phẩm giả lập giống cuaHang.vue
const products = ref([
  {
    product_id: 1,
    product_name: 'Nồi Gang Tráng Men KitChef Đỏ Cherry 24cm',
    category: 'noi-chao',
    price: 2450000,
    originalPrice: 2950000,
    rating: 5,
    badge: 'Bán chạy',
    image_url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=500&q=80'
  },
  {
    product_id: 2,
    product_name: 'Chảo Chống Dính Vân Đá Cao Cấp Tefal 28cm',
    category: 'noi-chao',
    price: 890000,
    originalPrice: 1150000,
    rating: 4,
    badge: 'Giảm 22%',
    image_url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=500&q=80'
  },
  {
    product_id: 5,
    product_name: 'Chảo Gang Nướng Chuyên Dụng Lodge Đáy Khía 26cm',
    category: 'noi-chao',
    price: 1250000,
    originalPrice: 1450000,
    rating: 5,
    badge: 'Nhập khẩu',
    image_url: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=500&q=80'
  }
])

const searchQuery = ref('')
const sortByOption = ref('default')

// Bộ lọc tự động lọc riêng danh mục nồi chảo
const filteredProducts = computed(() => {
  let result = products.value.filter(p => p.category === 'noi-chao')
  if (searchQuery.value.trim() !== '') {
    result = result.filter(p => p.product_name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }
  if (sortByOption.value === 'price-asc') result.sort((a, b) => a.price - b.price)
  if (sortByOption.value === 'price-desc') result.sort((a, b) => b.price - a.price)
  return result
})

const formatPrice = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
</script>

<template>
  <div class="shop-page-wrapper">
    <div class="shop-hero">
      <div class="container">
        <div class="breadcrumb">
          <RouterLink to="/">Trang chủ</RouterLink>
          <i class="fa-solid fa-angle-right">></i>
          <span>Nồi Chảo</span>
        </div>
        <h1>BỘ SƯU TẬP NỒI CHẢO CAO CẤP</h1>
        <p>Các sản phẩm giữ nhiệt tốt, chống dính hoàn hảo cho bếp từ và mọi loại bếp.</p>
      </div>
    </div>

    <div class="container shop-body">
      <div class="shop-control-bar">
        <input type="text" v-model="searchQuery" placeholder="Tìm trong danh mục này..." class="search-input-mini" />
        <select v-model="sortByOption" class="sort-dropdown">
          <option value="default">Mặc định</option>
          <option value="price-asc">Giá: Thấp đến Cao</option>
          <option value="price-desc">Giá: Cao đến Thấp</option>
        </select>
      </div>

      <div class="products-grid" v-if="filteredProducts.length > 0">
        <div v-for="prod in filteredProducts" :key="prod.product_id" class="product-card">
          <span v-if="prod.badge" class="product-badge">{{ prod.badge }}</span>
          <div class="product-image-box">
            <img :src="prod.image_url" :alt="prod.product_name" class="product-img" />
          </div>
          <div class="product-info-box">
            <h3 class="product-title">{{ prod.product_name }}</h3>
            <div class="product-price-row">
              <span class="current-price">{{ formatPrice(prod.price) }}</span>
            </div>
            <button class="btn-add-cart">Thêm vào giỏ</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shop-page-wrapper {
  background-color: #f9fbf9;
  color: #2c3e50;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding-bottom: 80px;
}

.container {
  max-width: 1250px;
  margin: 0 auto;
  padding: 0 20px;
}

.shop-hero {
  background: linear-gradient(135deg, #e8f5ec 0%, #ffffff 100%);
  border-bottom: 1px solid #e1ebe3;
  padding: 40px 0;
  margin-bottom: 30px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  margin-bottom: 15px;
}

.breadcrumb a {
  color: #5c6a60;
  text-decoration: none;
  font-weight: 600;
}

.breadcrumb span {
  color: #4CAF50;
  font-weight: 700;
}

.shop-hero h1 {
  font-size: 2rem;
  font-weight: 850;
  color: #1a251e;
  margin: 0 0 10px 0;
}

.shop-hero p {
  color: #5c6a60;
  font-size: 1rem;
}

.shop-control-bar {
  background-color: #ffffff;
  border: 1px solid #eef3ef;
  border-radius: 12px;
  padding: 15px 25px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-input-mini {
  padding: 8px 15px;
  border: 1px solid #cedbd0;
  border-radius: 6px;
  width: 250px;
  outline: none;
}

.search-input-mini:focus {
  border-color: #4CAF50;
}

.sort-dropdown {
  padding: 8px 15px;
  border: 1px solid #cedbd0;
  border-radius: 6px;
  background-color: #ffffff;
  cursor: pointer;
}

/* LƯỚI SẢN PHẨM GRID */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Hiện 4 cột trên PC vì không có sidebar */
  gap: 25px;
}

.product-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #eef3ef;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.06);
}

.product-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: #ff3b30;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 20px;
  z-index: 2;
}

.product-image-box {
  width: 100%;
  height: 200px;
  background-color: #fafafa;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info-box {
  padding: 15px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 10px 0;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price-row {
  margin-top: auto;
  margin-bottom: 12px;
}

.current-price {
  font-size: 1.1rem;
  font-weight: 850;
  color: #ff3b30;
}

.btn-add-cart {
  width: 100%;
  padding: 10px;
  background-color: #f4fbf6;
  border: 1px solid #e1ebe3;
  color: #4CAF50;
  font-weight: 700;
  font-size: 0.85rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add-cart:hover {
  background-color: #4CAF50;
  color: #ffffff;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .products-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
  .products-grid { grid-template-columns: repeat(2, 1fr); }
  .shop-control-bar { flex-direction: column; gap: 15px; align-items: stretch; }
  .search-input-mini { width: 100%; }
}
@media (max-width: 480px) {
  .products-grid { grid-template-columns: 1fr; }
}
</style>