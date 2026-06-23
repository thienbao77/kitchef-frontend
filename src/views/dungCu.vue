<script setup>
import { ref, computed } from 'vue'

const products = ref([
  {
    product_id: 7,
    product_name: 'Khay Đựng Dao Kéo Thớt Tre Kháng Khuẩn Nhà Bếp',
    category: 'phu-kien-bep',
    price: 490000,
    originalPrice: 590000,
    rating: 5,
    badge: 'Tiện dụng',
    image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=500&q=80'
  },
  {
    product_id: 3,
    product_name: 'Bộ Dao Nhà Bếp Damascus Nhật Bản 3 Món',
    category: 'dao-keo',
    price: 3200000,
    rating: 5,
    badge: 'Cao cấp',
    image_url: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=500&q=80'
  }
])

const searchQuery = ref('')

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return products.value
  return products.value.filter(p => p.product_name.toLowerCase().includes(searchQuery.value.toLowerCase()))
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
          <span>Dụng cụ gian bếp</span>
        </div>
        <h1>DỤNG CỤ & PHỤ KIỆN BẾP CHUYÊN NGHIỆP</h1>
        <p>Từ các bộ dao kéo đúc nguyên khối đến phụ kiện tre kháng khuẩn thông minh.</p>
      </div>
    </div>

    <div class="container shop-body">
      <div class="products-grid">
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