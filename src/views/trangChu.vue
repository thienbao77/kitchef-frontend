<script setup>
import { ref } from 'vue'
// 1. Import file banner.vue hiển thị ở đầu Trang Chủ
import Banner from '../components/banner.vue'

// 2. Giả lập dữ liệu danh sách sản phẩm nổi bật để test giao diện
const products = ref([
  {
    id: 101,
    name: 'Bộ dao làm bếp cao cấp 5 món Thép Đức',
    category: 'Dao kéo',
    price: 1250000,
    image: 'https://via.placeholder.com/250x200',
    isHot: true
  },
  {
    id: 102,
    name: 'Chảo chống dính vân đá đáy từ 28cm',
    category: 'Nồi chảo',
    price: 450000,
    image: 'https://via.placeholder.com/250x200',
    isHot: true
  },
  {
    id: 103,
    name: 'Thớt gỗ nghiến kháng khuẩn xuất khẩu',
    category: 'Thớt bếp',
    price: 320000,
    image: 'https://via.placeholder.com/250x200',
    isHot: false
  },
  {
    id: 104,
    name: 'Máy xay thịt cối thủy tinh đa năng KitChef',
    category: 'Thiết bị điện',
    price: 850000,
    image: 'https://via.placeholder.com/250x200',
    isHot: true
  }
])

// Hàm xử lý nhanh khi khách bấm nút Thêm vào giỏ hàng
const addToCart = (product) => {
  alert(`Đã thêm vào giỏ hàng: ${product.name}\n(Chức năng kết nối API Spring Boot sẽ xử lý ở bước sau)`)
}

// Hàm định dạng tiền tệ VND (Ví dụ: 1250000 -> 1.250.000 đ)
const formatPrice = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}
</script>

<template>
  <div class="trang-chu-container">
    <Banner />

    <div class="home-content">
      <div class="section-header">
        <h2>SẢN PHẨM NỔI BẬT</h2>
        <div class="decor-line"></div>
        <p>Danh sách các dụng cụ làm bếp cao cấp dành riêng cho không gian ẩm thực của bạn</p>
      </div>

      <div class="products-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          
          <div class="product-img-wrapper">
            <span v-if="product.isHot" class="badge-hot">BÁN CHẠY</span>
            <img :src="product.image" :alt="product.name" class="product-img" />
          </div>

          <div class="product-info">
            <span class="product-cate">{{ product.category }}</span>
            <h3 class="product-name" :title="product.name">{{ product.name }}</h3>
            <p class="product-price">{{ formatPrice(product.price) }}</p>
            
            <button @click="addToCart(product)" class="btn-add-cart">
              THÊM VÀO GIỎ 🛒
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trang-chu-container {
  background-color: #000000;
  color: #ffffff;
  min-height: 100vh;
  font-family: "Segoe UI", Roboto, sans-serif;
}

.home-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

/* Tiêu đề phân khu */
.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 1.5px;
  margin-bottom: 5px;
}

.decor-line {
  width: 60px;
  height: 3px;
  background-color: #4CAF50; /* Đường vạch xanh lá thương hiệu */
  margin: 10px auto;
  border-radius: 2px;
}

.section-header p {
  color: #888888;
  font-size: 0.95rem;
}

/* Cấu trúc Grid chia cột */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Mặc định chia làm 4 cột đều nhau */
  gap: 25px;
}

/* Thẻ bọc từng sản phẩm độc lập */
.product-card {
  background-color: #111111;
  border: 1px solid #222222;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  border-color: #333333;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}

/* Khối xử lý ảnh */
.product-img-wrapper {
  position: relative;
  background-color: #1a1a1a;
  width: 100%;
  padding-top: 80%; /* Tạo khung tỉ lệ cố định tránh vỡ bố cục khi ảnh thật lệch kích thước */
}

.product-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Nhãn Bán chạy màu đỏ cam */
.badge-hot {
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: #ff3b30;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  z-index: 2;
  letter-spacing: 0.5px;
}

/* Chi tiết chữ nghĩa */
.product-info {
  padding: 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.product-cate {
  font-size: 0.75rem;
  color: #4CAF50;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
}

.product-name {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 5px 0 10px 0;
  line-height: 1.4;
  color: #ffffff;
  height: 40px; /* Giới hạn độ cao để tên dài 2 dòng không đẩy nút lệch hàng */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 15px;
}

/* Nút thêm vào giỏ hàng tinh tế */
.btn-add-cart {
  width: 100%;
  background-color: transparent;
  border: 1px solid #4CAF50;
  color: #4CAF50;
  padding: 10px 0;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: auto; /* Đẩy nút xuống sát đáy card nếu card rỗng */
}

.btn-add-cart:hover {
  background-color: #4CAF50;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

/* RESPONSIVE: Tự co giãn linh hoạt theo kích thước màn hình */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr); /* Màn hình máy tính bảng: 3 cột */
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr); /* Màn hình điện thoại lớn: 2 cột */
    gap: 15px;
  }
  .section-header h2 {
    font-size: 1.6rem;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(1, 1fr); /* Màn hình điện thoại nhỏ: 1 cột đứng độc nhất */
  }
}
</style>