<script setup>
// import { ref, computed } from 'vue'
import { ref, computed, onMounted } from 'vue' // Thêm onMounted
import axios from 'axios' // Đảm bảo đã import axios

// 1. CÁC BIẾN SỰ KIỆN GIAO TIẾP VỚI APP
const emit = defineEmits(['change-page', 'add-to-cart'])

// 2. MẢNG DANH MỤC KHỚP VỚI BẢNG CATEGORIES (Dùng category_id thay vì string)
const categories = ref([
  { category_id: 'all', category_name: 'Tất Cả Sản Phẩm' },
  { category_id: 1, category_name: 'Nồi, Chảo' },
  { category_id: 2, category_name: 'Dao, Kéo' },
  { category_id: 3, category_name: 'Tô, Chén, Dĩa' },
  { category_id: 4, category_name: 'Phụ kiện bếp' },
  { category_id: 5, category_name: 'Khác' }
])

// 3. MẢNG SẢN PHẨM KHỚP 100% VỚI BẢNG PRODUCTS MỚI (Có slug và category_id)
const products = ref([])

// Thêm hàm lấy dữ liệu
const fetchProducts = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/products')
    products.value = res.data // Gán dữ liệu thật vào đây
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error)
  }
}
// 4. CÁC BIẾN KIỂM SOÁT BỘ LỌC (REACTIVE STATE)
const searchQuery = ref('')
const selectedCategory = ref('all') // So sánh với category_id
const maxPriceLimit = ref(5000000)
const sortByOption = ref('default')

// 5. TOAST THÔNG BÁO THÊM GIỎ HÀNG THÀNH CÔNG
const showToast = ref(false)
const toastMessage = ref('')

const addToCart = async (productId, productName) => {
  try {
    // Thay vì const CURRENT_USER_ID = 1;
const user = JSON.parse(localStorage.getItem("user"));
const CURRENT_USER_ID = user ? user.userId : null;
    await axios.post(`http://localhost:8080/api/cart/${CURRENT_USER_ID}/add`, {
      productId: productId,
      quantity: 1,
    });

    toastMessage.value = `Đã thêm thành công "${productName}" vào giỏ hàng!`;
    showToast.value = true;
    setTimeout(() => (showToast.value = false), 2500);
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ:", error);
  }
};

// 6. LOGIC LỌC VÀ SẮP XẾP SẢN PHẨM ĐỘNG (COMPUTED)
const filteredAndSortedProducts = computed(() => {
  let result = [...products.value];

  // A. Lọc theo từ khóa tìm kiếm (SỬA Ở ĐÂY)
  if (searchQuery.value.trim() !== "") {
    const keyword = searchQuery.value.toLowerCase().trim();
    result = result.filter((p) =>
      // PHẢI LÀ p.productName (theo Entity Java), không phải p.product_name
      p.productName && p.productName.toLowerCase().includes(keyword)
    );
  }

  // B. Lọc theo Danh mục sản phẩm (So sánh theo category_id)
  if (selectedCategory.value !== 'all') {
    // Thay đổi dòng này:
result = result.filter(p => {
    const pCatId = p.category ? p.category.id : null;
    return pCatId === selectedCategory.value;
})
  }

  // C. Lọc theo khoảng giá (từ 0 đến giá giới hạn chọn)
  result = result.filter(p => p.price <= maxPriceLimit.value)

  // D. Sắp xếp kết quả hiển thị
  if (sortByOption.value === 'price-asc') {
    result.sort((a, b) => a.price - b.price) // Giá tăng dần
  } else if (sortByOption.value === 'price-desc') {
    result.sort((a, b) => b.price - a.price) // Giá giảm dần
  } else if (sortByOption.value === 'rating-desc') {
    result.sort((a, b) => b.rating - a.rating) // Đánh giá sao cao nhất trước
  }

  return result;
})

// 7. ĐỊNH DẠNG TIỀN TỆ VND
const formatPrice = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

// 8. LOGIC YÊU THÍCH SẢN PHẨM
const favoriteIds = ref(new Set())
const toggleFavorite = (productId) => {
  if (favoriteIds.value.has(productId)) {
    favoriteIds.value.delete(productId)
  } else {
    favoriteIds.value.add(productId)
  }
}


onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="shop-page-wrapper">
    <div class="shop-hero">
      <div class="container">
        <div class="breadcrumb">
          <RouterLink to="/">Trang chủ</RouterLink>
          <i class="fa ball-icon fa-angle-right">></i>
          <span class="current-page">Cửa hàng</span>
        </div>
        <h1>TẤT CẢ DỤNG CỤ GIAN BẾP</h1>
        <p>Tìm kiếm và chọn lựa những thiết bị, phụ kiện bếp cao cấp chính hãng KitChef.</p>
      </div>
    </div>

    <div class="container shop-body">
      <div class="shop-layout">
        
        <aside class="shop-sidebar">
          
          <div class="filter-widget">
            <h3 class="widget-title">Tìm kiếm sản phẩm</h3>
            <div class="search-box">
              <input type="text" v-model="searchQuery" placeholder="Nhập tên sản phẩm..." class="filter-search-input" />
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
            </div>
          </div>

          <div class="filter-widget">
            <h3 class="widget-title">Danh mục</h3>
            <ul class="sidebar-cat-list">
              <li 
                v-for="cat in categories" 
                :key="cat.category_id"
                :class="{ 'active': selectedCategory === cat.category_id }"
                @click="selectedCategory = cat.category_id"
              >
                <span class="cat-name">{{ cat.category_name }}</span>
                <i class="fa-solid fa-angle-right arrow-icon"></i>
              </li>
            </ul>
          </div>

          <div class="filter-widget">
            <h3 class="widget-title">Khoảng giá (VND)</h3>
            <div class="price-slider-box">
              <input type="range" v-model.number="maxPriceLimit" min="100000" max="5000000" step="50000"
                class="price-range-slider" />
              <div class="price-values-row">
                <span>0 đ</span>
                <span class="selected-max-price">Dưới: {{ formatPrice(maxPriceLimit) }}</span>
              </div>
            </div>
          </div>

          <button 
            class="btn-reset-filters" 
            @click="searchQuery = ''; selectedCategory = 'all'; maxPriceLimit = 5000000; sortByOption = 'default';"
          >
            <i class="fa-solid fa-arrow-rotate-left"></i> Đặt lại bộ lọc
          </button>

        </aside>

        <main class="shop-main-content">
          
          <div class="shop-control-bar">
            <p class="products-found-text">
              Tìm thấy <strong class="highlight-text">{{ filteredAndSortedProducts.length }}</strong> sản phẩm phù hợp.
            </p>
            <div class="sort-select-box">
              <label for="sort-select">Sắp xếp theo:</label>
              <select id="sort-select" v-model="sortByOption" class="sort-dropdown">
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="rating-desc">Đánh giá sao cao nhất</option>
              </select>
            </div>
          </div>

          <div class="products-grid-wrapper" v-if="filteredAndSortedProducts.length > 0">
            <div class="products-grid">
              <div 
                v-for="prod in filteredAndSortedProducts" 
                :key="prod.product_id" 
                class="product-card"
              >
                <span v-if="prod.badge" class="product-badge">{{ prod.badge }}</span>

                <div class="product-image-box">
                  <router-link :to="`/san-pham/${prod.productId}`">
                    <img :src="prod.imageUrl" :alt="prod.productName" class="product-img" />
                  </router-link>
                  
                  <div class="product-hover-actions">
                    <button class="action-circle-btn" :class="{ 'is-favorite': favoriteIds.has(prod.product_id) }"
                      title="Yêu thích" @click="toggleFavorite(prod.product_id)">
                      <i :class="favoriteIds.has(prod.product_id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                    </button>
                  </div>
                </div>

                <div class="product-info-box">
                  <router-link :to="`/san-pham/${prod.productId}`" class="product-title-link">
                    <h3 class="product-title" :title="prod.productName">{{ prod.productName }}</h3>
                  </router-link>
                  
                  <div class="product-rating">
                    <i v-for="star in 5" :key="star" class="fa-star"
                      :class="star <= prod.rating ? 'fa-solid' : 'fa-regular'"></i>
                    <span class="rating-text">({{ prod.rating }}.0)</span>
                  </div>

                  <div class="product-price-row">
                    <span class="current-price">{{ formatPrice(prod.price) }}</span>
                    <span class="original-price" v-if="prod.originalPrice">
                      {{ formatPrice(prod.originalPrice) }}
                    </span>
                  </div>

                  <button class="btn-add-cart" v-if="prod.stockQuantity > 0" @click="addToCart(prod.productId, prod.productName)">
                    <i class="fa-solid fa-cart-plus"></i>
                    <span>Thêm vào giỏ</span>
                  </button>
                  <button class="btn-add-cart out-of-stock-btn" v-else disabled>
                    <i class="fa-solid fa-ban"></i>
                    <span>Tạm hết hàng</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="empty-shop-results" v-else>
            <i class="fa-regular fa-face-frown empty-icon"></i>
            <h3>Không tìm thấy sản phẩm!</h3>
            <p>Vui lòng đổi từ khóa tìm kiếm hoặc mở rộng khoảng giá lọc để xem thêm.</p>
          </div>

        </main>

      </div>
    </div>
    
    <div class="toast-notification" :class="{ show: showToast }">
      <div class="toast-content">
        <i class="fa-solid fa-circle-check toast-icon"></i>
        <span class="toast-msg">{{ toastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========================================================
   GIAO DIỆN SÁNG (LIGHT MODE) - TRẮNG & XANH LÁ CHỦ ĐẠO
   ======================================================== */
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

/* 1. HERO BANNER TIÊU ĐỀ TRANG */
.shop-hero {
  background: linear-gradient(135deg, #e8f5ec 0%, #ffffff 100%);
  border-bottom: 1px solid #e1ebe3;
  padding: 50px 0;
  margin-bottom: 40px;
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
  transition: color 0.2s;
}

.breadcrumb a:hover {
  color: #4CAF50;
}

.breadcrumb i {
  font-size: 0.75rem;
  color: #a0a0a0;
}

.breadcrumb span {
  color: #4CAF50;
  font-weight: 700;
}

.shop-hero h1 {
  font-size: 2.2rem;
  font-weight: 850;
  color: #1a251e;
  margin: 0 0 10px 0;
  letter-spacing: 0.5px;
}

.shop-hero p {
  color: #5c6a60;
  font-size: 1.05rem;
  margin: 0;
  line-height: 1.5;
}

/* ========================================================
   2. BỐ CỤC HAI CỘT (SIDEBAR & MAIN CONTENT)
   ======================================================== */
.shop-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  /* Sidebar cố định 280px */
  gap: 40px;
  align-items: start;
}

/* 🟢 THANH BỘ LỌC CHI TIẾT (SIDEBAR BÊN TRÁI) */
.shop-sidebar {
  background-color: #ffffff;
  border: 1px solid #eef3ef;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.01);
}

.filter-widget {
  margin-bottom: 30px;
  padding-bottom: 25px;
  border-bottom: 1px solid #f0f4f1;
}

.filter-widget:last-of-type {
  border-bottom: none;
  margin-bottom: 20px;
}

.widget-title {
  font-size: 1.05rem;
  font-weight: 750;
  color: #1a251e;
  margin: 0 0 15px 0;
  letter-spacing: 0.3px;
}

/* Khung tìm kiếm */
.search-box {
  position: relative;
  width: 100%;
}

.filter-search-input {
  width: 100%;
  padding: 11px 40px 11px 15px;
  background-color: #f9fbf9;
  border: 1px solid #cedbd0;
  border-radius: 8px;
  color: #2c3e50;
  font-size: 0.9rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.filter-search-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0a0a0;
  font-size: 0.95rem;
}

/* Bộ lọc danh mục */
.sidebar-cat-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-cat-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a554f;
  transition: all 0.2s ease;
}

.sidebar-cat-list li:hover {
  background-color: #f4fbf6;
  color: #4CAF50;
}

.sidebar-cat-list li.active {
  background-color: #4CAF50;
  color: #ffffff;
}

.arrow-icon {
  font-size: 0.75rem;
  opacity: 0.7;
}

/* Lọc khoảng giá */
.price-slider-box {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.price-range-slider {
  width: 100%;
  accent-color: #4CAF50;
  /* Màu xanh lá cho nút kéo */
  cursor: pointer;
}

.price-values-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  font-weight: 600;
  color: #888888;
}

.selected-max-price {
  color: #4CAF50;
  font-weight: 700;
}

/* Nút Đặt lại bộ lọc */
.btn-reset-filters {
  width: 100%;
  padding: 11px;
  background-color: #f5f5f5;
  border: none;
  color: #666666;
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-reset-filters:hover {
  background-color: #ff3b30;
  color: #ffffff;
}

/* ========================================================
   3. GIAO DIỆN SẢN PHẨM PHÍA BÊN PHẢI (MAIN SHOP CONTENT)
   ======================================================== */
.shop-main-content {
  display: flex;
  flex-direction: column;
}

/* Thanh bar điều khiển */
.shop-control-bar {
  background-color: #ffffff;
  border: 1px solid #eef3ef;
  border-radius: 12px;
  padding: 15px 25px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.01);
}

.products-found-text {
  font-size: 0.95rem;
  color: #5c6a60;
  margin: 0;
  font-weight: 600;
}

.highlight-text {
  color: #4CAF50;
}

.sort-select-box {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a554f;
}

.sort-dropdown {
  padding: 8px 15px;
  border: 1px solid #cedbd0;
  background-color: #ffffff;
  border-radius: 6px;
  color: #2c3e50;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  font-size: 0.85rem;
}

.sort-dropdown:focus {
  border-color: #4CAF50;
}

/* Lưới Grid sản phẩm */
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* 3 cột trên PC bên phải */
  gap: 30px;
}

/* CARD SẢN PHẨM ĐỒNG BỘ */
.product-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #eef3ef;
  overflow: hidden;
  position: relative;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.01);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.08);
  border-color: #cedbd0;
}

.product-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: #ff3b30;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  z-index: 5;
  box-shadow: 0 2px 6px rgba(255, 59, 48, 0.2);
}

.product-image-box {
  width: 100%;
  height: 220px;
  overflow: hidden;
  position: relative;
  background-color: #fafafa;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-img {
  transform: scale(1.06);
}

.product-hover-actions {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-hover-actions {
  opacity: 1;
}

.action-circle-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #ffffff;
  border: none;
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  font-size: 1.15rem;
}

.action-circle-btn:hover {
  background-color: #ff3b30;
  color: #ffffff;
  transform: scale(1.1);
}

.action-circle-btn.is-favorite {
  color: #ff3b30;
}

.action-circle-btn.is-favorite:hover {
  background-color: #ff3b30;
  color: #ffffff;
}

.product-info-box {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 10px 0;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-bottom: 15px;
}

.product-rating i {
  font-size: 0.8rem;
}

.fa-solid.fa-star {
  color: #ffb400;
}

.fa-regular.fa-star {
  color: #ccc;
}

.rating-text {
  font-size: 0.75rem;
  color: #888888;
  margin-left: 5px;
}

.product-price-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 20px;
  margin-top: auto;
}

.current-price {
  font-size: 1.15rem;
  font-weight: 850;
  color: #ff3b30;
}

.original-price {
  font-size: 0.8rem;
  color: #a0a0a0;
  text-decoration: line-through;
}

.btn-add-cart {
  width: 100%;
  padding: 12px;
  background-color: #f4fbf6;
  border: 1px solid #e1ebe3;
  color: #4CAF50;
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-add-cart:hover {
  background-color: #4CAF50;
  border-color: #4CAF50;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.25);
}

/* KHU VỰC KẾT QUẢ RỖNG */
.empty-shop-results {
  text-align: center;
  padding: 80px 20px;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px dashed #cedbd0;
  margin-top: 10px;
}

.empty-icon {
  font-size: 3.5rem;
  color: #cedbd0;
  margin-bottom: 15px;
}

.empty-shop-results h3 {
  font-size: 1.3rem;
  color: #1a251e;
  margin: 0 0 10px 0;
}

.empty-shop-results p {
  color: #888888;
  font-size: 0.95rem;
  margin: 0;
}

/* ========================================================
   TOAST THÔNG BÁO THÀNH CÔNG
   ======================================================== */
.toast-notification {
  position: fixed;
  bottom: 30px;
  right: -450px;
  z-index: 9999;
  transition: right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-notification.show {
  right: 30px;
}

.toast-content {
  background-color: #111a13;
  border: 1px solid #1a2d1f;
  color: #2ecc71;
  padding: 16px 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.toast-icon {
  font-size: 1.3rem;
}

.toast-msg {
  font-weight: 600;
  font-size: 0.9rem;
}

/* ========================================================
   RESPONSIVE CHO TRANG CỬA HÀNG
   ======================================================== */
@media (max-width: 1024px) {
  .shop-layout {
    grid-template-columns: 240px 1fr;
    gap: 25px;
  }

  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    /* 2 cột trên ipad */
  }
}

@media (max-width: 768px) {
  .shop-layout {
    grid-template-columns: 1fr;
    /* Đẩy Sidebar lên trên dạng một cột */
    gap: 30px;
  }

  .shop-hero {
    padding: 35px 0;
    text-align: center;
  }

  .breadcrumb {
    justify-content: center;
  }

  .shop-hero h1 {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
    /* 1 cột trên điện thoại nhỏ */
  }
}
</style>