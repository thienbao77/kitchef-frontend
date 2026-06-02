<script setup>
import { ref, computed } from 'vue'
import trangChu from './trangChu.vue'

// 1. Định nghĩa sự kiện gửi ngược lên App.vue để đổi trang và xử lý giỏ hàng
const emit = defineEmits(['change-page', 'add-to-cart'])

// 2. MẢNG DANH MỤC SẢN PHẨM KHỚP 100% VỚI ĐỊNH DẠNG DATABASE CỦA BẠN
const categories = ref([
  { id: 'all', name: 'Tất Cả Sản Phẩm' },
  { id: 'noi-chao', name: 'Nồi, Chảo' },
  { id: 'dao-keo', name: 'Dao, Kéo' },
  { id: 'to-chen-dia', name: 'Tô, Chén, Đĩa' },
  { id: 'phu-kien-an', name: 'Phụ kiện ăn' },
  { id: 'phu-kien-bep', name: 'Phụ kiện bếp' },
  { id: 'khac', name: 'Khác' }
])

// 3. MẢNG TOÀN BỘ SẢN PHẨM GIẢ LẬP (Sẵn sàng kết nối API Spring Boot sau này)
const products = ref([
  {
    product_id: 1,
    product_name: 'Nồi Gang Tráng Men KitChef Đỏ Cherry 24cm',
    category: 'noi-chao',
    price: 2450000,
    originalPrice: 2950000,
    rating: 5,
    badge: 'Bán chạy',
    image_url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=500&q=80',
    description: 'Nồi gang cao cấp tráng men đa lớp giữ nhiệt hoàn hảo, chuyên dùng cho các món ninh, hầm, kho. Tiêu chuẩn châu Âu an toàn tuyệt đối.'
  },
  {
    product_id: 2,
    product_name: 'Chảo Chống Dính Vân Đá Cao Cấp Tefal 28cm',
    category: 'noi-chao',
    price: 890000,
    originalPrice: 1150000,
    rating: 4,
    badge: 'Giảm 22%',
    image_url: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=500&q=80',
    description: 'Bề mặt vân đá phủ lớp chống dính Titanium siêu bền từ Pháp. Đáy từ truyền nhiệt nhanh, tương thích mọi loại bếp thông dụng.'
  },
  {
    product_id: 3,
    product_name: 'Bộ Dao Nhà Bếp Damascus Nhật Bản 3 Món',
    category: 'dao-keo',
    price: 3200000,
    originalPrice: 3800000,
    rating: 5,
    badge: 'Cao cấp',
    image_url: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=500&q=80',
    description: 'Được rèn thủ công từ 67 lớp thép Damascus trứ danh, độ sắc bén đạt mức tối đa. Tay cầm gỗ nạm đinh tinh xảo chống trơn trượt.'
  },
  {
    product_id: 4,
    product_name: 'Bộ Bát Đĩa Sứ Viền Vàng Phong Cách Bắc Âu (Set 16 món)',
    category: 'to-chen-dia',
    price: 1100000,
    originalPrice: 1350000,
    rating: 5,
    badge: 'Decor Đẹp',
    image_url: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=500&q=80',
    description: 'Chất sứ xương hoàng gia sáng bóng, viền mạ vàng 18k tinh tế. Bộ sản phẩm decor bàn ăn hoàn mỹ cho các bữa tiệc gia đình ấm cúng.'
  },
  {
    product_id: 5,
    product_name: 'Chảo Gang Nướng Chuyên Dụng Lodge Đáy Khía 26cm',
    category: 'noi-chao',
    price: 1250000,
    originalPrice: 1450000,
    rating: 5,
    badge: 'Nhập khẩu',
    image_url: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=500&q=80',
    description: 'Chảo gang đúc nguyên khối nhập khẩu trực tiếp từ Mỹ. Giúp tạo các đường vân cháy sém hấp dẫn như nhà hàng cho các món bít tết, nướng áp chảo.'
  },
  {
    product_id: 6,
    product_name: 'Bộ Muỗng Đũa Thìa Gỗ Mun Tự Nhiên Cao Cấp',
    category: 'phu-kien-an',
    price: 350000,
    originalPrice: 450000,
    rating: 4,
    badge: 'Mộc mạc',
    image_url: 'https://images.unsplash.com/photo-1542382257-201b7f816a46?auto=format&fit=crop&w=500&q=80',
    description: 'Chất liệu gỗ mun tự nhiên nguyên khối được mài nhẵn mịn bóng mượt. Đảm bảo an toàn sức khỏe tuyệt đối, phong cách sang trọng và gần gũi.'
  },
  {
    product_id: 7,
    product_name: 'Khay Đựng Dao Kéo Thớt Tre Kháng Khuẩn Nhà Bếp',
    category: 'phu-kien-bep',
    price: 490000,
    originalPrice: 590000,
    rating: 5,
    badge: 'Tiện dụng',
    image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=500&q=80',
    description: 'Kệ sắp xếp các dụng cụ nấu ăn làm từ tre ép tự nhiên. Thiết kế thông minh giúp ráo nước nhanh, chống mốc hỏng hiệu quả.'
  },
  {
    product_id: 8,
    product_name: 'Thớt Gỗ Teak Decor Bàn Ăn Chuyên Nghiệp',
    category: 'khac',
    price: 650000,
    originalPrice: 800000,
    rating: 5,
    badge: 'Yêu thích',
    image_url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=500&q=80',
    description: 'Thớt gỗ Teak siêu bền bỉ với những đường vân tự nhiên bắt mắt, vừa làm thớt băm chặt nhẹ vừa làm khay decor bày biện món ăn cực đẹp.'
  }
])

// 4. CÁC BIẾN KIỂM SOÁT BỘ LỌC (REACTIVE STATE)
const searchQuery = ref('')
const selectedCategory = ref('all')
const maxPriceLimit = ref(5000000) // Giới hạn giá tối đa lọc (5 triệu VND)
const sortByOption = ref('default') // 'default', 'price-asc', 'price-desc', 'rating-desc'

// 5. TOAST THÔNG BÁO THÊM GIỎ HÀNG THÀNH CÔNG
const showToast = ref(false)
const toastMessage = ref('')

const addToCart = (productName) => {
  toastMessage.value = `Đã thêm thành công "${productName}" vào giỏ hàng!`
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 2500)
}

// 6. LOGIC LỌC VÀ SẮP XẾP SẢN PHẨM ĐỘNG (COMPUTED)
const filteredAndSortedProducts = computed(() => {
  let result = [...products.value]

  // A. Lọc theo từ khóa tìm kiếm (Tên sản phẩm)
  if (searchQuery.value.trim() !== '') {
    const keyword = searchQuery.value.toLowerCase().trim()
    result = result.filter(p => p.product_name.toLowerCase().includes(keyword))
  }

  // B. Lọc theo Danh mục sản phẩm
  if (selectedCategory.value !== 'all') {
    result = result.filter(p => p.category === selectedCategory.value)
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

  return result
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
</script>

<template>
  <div class="shop-page-wrapper">
    <!-- TIÊU ĐỀ ĐẦU TRANG CỬA HÀNG -->
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
    <!-- KHU VỰC CHÍNH: BỘ LỌC BÊN CẠNH & GRID SẢN PHẨM -->
    <div class="container shop-body">
      <div class="shop-layout">

        <!-- 🟢 SIDEBAR: THANH BỘ LỌC CHI TIẾT BÊN TRÁI -->
        <aside class="shop-sidebar">

          <!-- Lọc A: Tìm kiếm từ khóa -->
          <div class="filter-widget">
            <h3 class="widget-title">Tìm kiếm sản phẩm</h3>
            <div class="search-box">
              <input type="text" v-model="searchQuery" placeholder="Nhập tên sản phẩm..." class="filter-search-input" />
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
            </div>
          </div>

          <!-- Lọc B: Chọn danh mục sản phẩm -->
          <div class="filter-widget">
            <h3 class="widget-title">Danh mục</h3>
            <ul class="sidebar-cat-list">
              <li v-for="cat in categories" :key="cat.id" :class="{ 'active': selectedCategory === cat.id }"
                @click="selectedCategory = cat.id">
                <span class="cat-name">{{ cat.name }}</span>
                <i class="fa-solid fa-angle-right arrow-icon"></i>
              </li>
            </ul>
          </div>

          <!-- Lọc C: Lọc theo khoảng giá -->
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

          <!-- Nút đặt lại toàn bộ lọc (Reset) -->
          <button class="btn-reset-filters"
            @click="searchQuery = ''; selectedCategory = 'all'; maxPriceLimit = 5000000; sortByOption = 'default';">
            <i class="fa-solid fa-arrow-rotate-left"></i> Đặt lại bộ lọc
          </button>

        </aside>

        <!-- 🟢 NỘI DUNG CHÍNH: DANH SÁCH SẢN PHẨM BÊN PHẢI -->
        <main class="shop-main-content">

          <!-- Thanh điều khiển hiển thị (Sắp xếp & Số lượng tìm thấy) -->
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

          <!-- Lưới sản phẩm (Grid) -->
          <div class="products-grid-wrapper" v-if="filteredAndSortedProducts.length > 0">
            <div class="products-grid">
              <div v-for="prod in filteredAndSortedProducts" :key="prod.product_id" class="product-card">
                <!-- Nhãn Badge -->
                <span v-if="prod.badge" class="product-badge">{{ prod.badge }}</span>

                <!-- Khung ảnh sản phẩm -->
                <div class="product-image-box">
                  <img :src="prod.image_url" :alt="prod.product_name" class="product-img" />

                  <!-- Lớp phủ tim yêu thích khi Hover -->
                  <div class="product-hover-actions">
                    <button class="action-circle-btn" :class="{ 'is-favorite': favoriteIds.has(prod.product_id) }"
                      title="Yêu thích" @click="toggleFavorite(prod.product_id)">
                      <i :class="favoriteIds.has(prod.product_id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                    </button>
                  </div>
                </div>

                <!-- Thông tin chữ -->
                <div class="product-info-box">
                  <h3 class="product-title" :title="prod.product_name">{{ prod.product_name }}</h3>

                  <!-- Đánh giá sao -->
                  <div class="product-rating">
                    <i v-for="star in 5" :key="star" class="fa-star"
                      :class="star <= prod.rating ? 'fa-solid' : 'fa-regular'"></i>
                    <span class="rating-text">({{ prod.rating }}.0)</span>
                  </div>

                  <!-- Giá cả -->
                  <div class="product-price-row">
                    <span class="current-price">{{ formatPrice(prod.price) }}</span>
                    <span class="original-price" v-if="prod.originalPrice">
                      {{ formatPrice(prod.originalPrice) }}
                    </span>
                  </div>

                  <!-- Nút thêm giỏ hàng -->
                  <button class="btn-add-cart" @click="addToCart(prod.product_name)">
                    <i class="fa-solid fa-cart-plus"></i>
                    <span>Thêm vào giỏ</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- THÔNG BÁO KHI LỌC KHÔNG RA KẾT QUẢ -->
          <div class="empty-shop-results" v-else>
            <i class="fa-regular fa-face-frown empty-icon"></i>
            <h3>Không tìm thấy sản phẩm!</h3>
            <p>Vui lòng đổi từ khóa tìm kiếm hoặc mở rộng khoảng giá lọc để xem thêm.</p>
          </div>

        </main>

      </div>
    </div>

    <!-- TOAST NOTIFICATION THÔNG BÁO THÊM GIỎ HÀNG THÀNH CÔNG -->
    <div class="toast-notification" :class="{ 'show': showToast }">
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