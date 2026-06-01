<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"; // 1. Import useRouter

const router = useRouter(); // 2. Khai báo router

// Định nghĩa sự kiện gửi ngược lên TrangChu -> App.vue để chuyển trang
const emit = defineEmits(["navigate-to-shop"]);

// 1. DỮ LIỆU GIẢ LẬP SẢN PHẨM (Mặc định hiển thị cố định 4 sản phẩm đẹp nhất ở trang chủ)
const products = ref([
  {
    product_id: 1,
    product_name: "Nồi Gang Tráng Men KitChef Đỏ Cherry 24cm",
    price: 2450000,
    originalPrice: 2950000,
    rating: 5,
    badge: "Bán chạy",
    image_url: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=500&q=80",
    description: "Nồi gang cao cấp tráng men đa lớp giữ nhiệt hoàn hảo, chuyên dùng cho các món ninh, hầm, kho. Tiêu chuẩn châu Âu an toàn tuyệt đối.",
  },
  {
    product_id: 2,
    product_name: "Chảo Chống Dính Vân Đá Cao Cấp Tefal 28cm",
    price: 890000,
    originalPrice: 1150000,
    rating: 4,
    badge: "Giảm 22%",
    image_url: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=500&q=80",
    description: "Bề mặt vân đá phủ lớp chống dính Titanium siêu bền từ Pháp. Đáy từ truyền nhiệt nhanh, tương thích mọi loại bếp thông dụng.",
  },
  {
    product_id: 3,
    product_name: "Bộ Dao Nhà Bếp Damascus Nhật Bản 3 Món",
    price: 3200000,
    originalPrice: 3800000,
    rating: 5,
    badge: "Cao cấp",
    image_url: "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=500&q=80",
    description: "Được rèn thủ công từ 67 lớp thép Damascus trứ danh, độ sắc bén đạt mức tối đa. Tay cầm gỗ nạm đinh tinh xảo chống trơn trượt.",
  },
  {
    product_id: 4,
    product_name: "Bộ Bát Đĩa Sứ Viền Vàng (Set 16 món)",
    price: 1100000,
    originalPrice: 1350000,
    rating: 5,
    badge: "Decor",
    image_url: "https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=500&q=80",
    description: "Chất sứ xương hoàng gia sáng bóng, viền mạ vàng 18k tinh tế. Bộ sản phẩm decor bàn ăn hoàn mỹ cho các bữa tiệc gia đình ấm cúng.",
  },
  {
    product_id: 5,
    product_name: "Bộ Nồi Inox 304 Đáy 5 Lớp KitChef Pro",
    price: 1850000,
    originalPrice: 2200000,
    rating: 5,
    badge: "Mới",
    image_url: "https://images.unsplash.com/photo-1622397193214-386d38faee78?auto=format&fit=crop&w=500&q=80",
    description: "Gồm 3 nồi kích thước khác nhau. Chất liệu Inox 304 không gỉ sét, đáy 5 lớp truyền nhiệt cực nhanh và tiết kiệm điện năng.",
  },
  {
    product_id: 6,
    product_name: "Máy Ép Chậm Trái Cây Nguyên Quả",
    price: 2100000,
    originalPrice: 2600000,
    rating: 4,
    badge: "Hot",
    image_url: "https://images.unsplash.com/photo-1600262174620-336336a5323a?auto=format&fit=crop&w=500&q=80",
    description: "Công nghệ ép chậm 40 vòng/phút giúp ép kiệt bã, giữ lại trọn vẹn 100% vitamin và hương vị tươi ngon của trái cây.",
  },
  {
    product_id: 7,
    product_name: "Thớt Gỗ Teak Kháng Khuẩn Vân Tự Nhiên",
    price: 450000,
    originalPrice: 550000,
    rating: 5,
    badge: "Bền bỉ",
    image_url: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=500&q=80",
    description: "Thớt gỗ Teak nhập khẩu không tạo mùn, chống ẩm mốc vượt trội. Thân thiện với lưỡi dao và dễ dàng vệ sinh sau khi dùng.",
  },
  {
    product_id: 8,
    product_name: "Lò Vi Sóng Điện Tử Kèm Nướng 23L",
    price: 1950000,
    originalPrice: 2300000,
    rating: 4,
    badge: "Sale",
    image_url: "https://images.unsplash.com/photo-1584269600519-112d071b6826?auto=format&fit=crop&w=500&q=80",
    description: "Kết hợp vi sóng và nướng tiện dụng. Bảng điều khiển cảm ứng tiếng Việt, chức năng rã đông nhanh giữ nguyên dinh dưỡng.",
  }
]);

// 2. ĐỊNH DẠNG TIỀN TỆ VND
const formatPrice = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

// 3. HỆ THỐNG TOAST THÔNG BÁO THÊM GIỎ HÀNG THÀNH CÔNG
const showToast = ref(false);
const toastMessage = ref("");

const addToCart = (productName) => {
  toastMessage.value = `Đã thêm thành công "${productName}" vào giỏ hàng!`;
  showToast.value = true;

  setTimeout(() => {
    showToast.value = false;
  }, 2500);
};

// 4. YÊU THÍCH SẢN PHẨM (TOGGLE FAVORITES)
const favoriteIds = ref(new Set());
const toggleFavorite = (productId) => {
  if (favoriteIds.value.has(productId)) {
    favoriteIds.value.delete(productId);
  } else {
    favoriteIds.value.add(productId);
  }
};

// 5. HÀM CHUYỂN HƯỚNG SANG TRANG CỬA HÀNG RIÊNG BIỆT
const goToShopPage = () => {
  router.push("/cua-hang");
};
</script>

<template>
  <section id="featured-products-anchor" class="products-section">
    <div class="container">
      <!-- TIÊU ĐỀ KHU VỰC -->
      <div class="section-header">
        <span class="sub-title">Sản Phẩm Tốt Nhất</span>
        <h2 class="main-title">SẢN PHẨM NỔI BẬT</h2>
        <div class="divider"></div>
      </div>

      <!-- LƯỚI GRID HIỂN THỊ SẢN PHẨM (MÁY TÍNH: 4 CỘT) -->
      <div class="products-grid">
        <div
          v-for="prod in products"
          :key="prod.product_id"
          class="product-card"
        >
          <!-- Nhãn (Badge) góc sản phẩm -->
          <span v-if="prod.badge" class="product-badge">{{ prod.badge }}</span>

          <!-- Khung ảnh sản phẩm -->
          <div class="product-image-box">
            <img
              :src="prod.image_url"
              :alt="prod.product_name"
              class="product-img"
            />

            <!-- Lớp phủ nút Hành động (Yêu thích) khi Hover -->
            <div class="product-hover-actions">
              <button
                class="action-circle-btn"
                :class="{ 'is-favorite': favoriteIds.has(prod.product_id) }"
                title="Yêu thích"
                @click="toggleFavorite(prod.product_id)"
              >
                <i
                  :class="
                    favoriteIds.has(prod.product_id)
                      ? 'fa-solid fa-heart'
                      : 'fa-regular fa-heart'
                  "
                ></i>
              </button>
            </div>
          </div>

          <!-- Hộp thông tin sản phẩm -->
          <div class="product-info-box">
            <h3 class="product-title" :title="prod.product_name">
              {{ prod.product_name }}
            </h3>

            <!-- Đánh giá sao -->
            <div class="product-rating">
              <i
                v-for="star in 5"
                :key="star"
                class="fa-star"
                :class="star <= prod.rating ? 'fa-solid' : 'fa-regular'"
              ></i>
              <span class="rating-text">({{ prod.rating }}.0)</span>
            </div>

            <!-- Giá tiền sản phẩm -->
            <div class="product-price-row">
              <span class="current-price">{{ formatPrice(prod.price) }}</span>
              <span class="original-price" v-if="prod.originalPrice">
                {{ formatPrice(prod.originalPrice) }}
              </span>
            </div>

            <!-- Nút thêm vào giỏ hàng -->
            <button class="btn-add-cart" @click="addToCart(prod.product_name)">
              <i class="fa-solid fa-cart-plus"></i>
              <span>Thêm vào giỏ</span>
            </button>
          </div>
        </div>
      </div>

      <!-- NÚT XEM THÊM - CHUYỂN HƯỚNG SANG TRANG CỬA HÀNG MỚI -->
      <div class="show-more-wrapper">
        <button class="btn-show-more" @click="goToShopPage">
          <span>Xem Toàn Bộ Sản Phẩm</span>
          <i class="fa-solid fa-arrow-right-long"></i>
        </button>
      </div>
    </div>

    <!-- TOAST NOTIFICATION THÔNG BÁO THÊM GIỎ HÀNG THÀNH CÔNG -->
    <div class="toast-notification" :class="{ show: showToast }">
      <div class="toast-content">
        <i class="fa-solid fa-circle-check toast-icon"></i>
        <span class="toast-msg">{{ toastMessage }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* CONTAINER CHUNG */
.container {
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 20px;
}

/* TIÊU ĐỀ PHÂN KHU */
.section-header {
  text-align: center;
  margin-bottom: 45px;
}

.sub-title {
  color: #4caf50; /* Màu xanh lá thương hiệu */
  font-size: 0.8rem;
  font-weight: 750;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: block;
  margin-bottom: 8px;
}

.main-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a251e;
  margin: 0;
  letter-spacing: 0.5px;
}

.divider {
  width: 50px;
  height: 3px;
  background-color: #4caf50;
  margin: 12px auto 0;
  border-radius: 2px;
}

/* PHÂN PHẦN CHUNG */
.products-section {
  padding: 40px 0 40px;
  background-color: #f9fbf9; /* Đồng bộ màu nền sáng của Trang Chủ */
}

/* LƯỚI SẢN PHẨM (MÁY TÍNH: 4 CỘT) */
.products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 30px;
}

/* THẺ SẢN PHẨM (CARD) */
.product-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #eef3ef;
  overflow: hidden;
  position: relative;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.02);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px); /* Nhấp nhẹ 3D lên */
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.08); /* Đổ bóng sâu */
  border-color: #cedbd0;
}

/* Nhãn sản phẩm (Badge) */
.product-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: #ff3b30; /* Tông màu đỏ thu hút chú ý */
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  z-index: 5;
  box-shadow: 0 2px 6px rgba(255, 59, 48, 0.2);
}

/* Khung ảnh sản phẩm */
.product-image-box {
  width: 100%;
  height: 230px; /* Chiều cao cố định chuẩn đẹp */
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
  transform: scale(1.06); /* Zoom nhẹ ảnh khi di chuột vào */
}

/* Các nút hành động nổi khi hover lên ảnh */
.product-hover-actions {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.15); /* Làm tối nhẹ nền ảnh */
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-hover-actions {
  opacity: 1; /* Hiện các nút hành động */
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

/* Nút trái tim khi được yêu thích */
.action-circle-btn.is-favorite {
  color: #ff3b30;
}
.action-circle-btn.is-favorite:hover {
  background-color: #ff3b30;
  color: #ffffff;
}

/* Hộp thông tin chữ */
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
  height: 40px; /* Khóa chiều cao cố định để không lệch card */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Đánh giá sao */
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
  color: #ffb400; /* Sao vàng lấp lánh */
}

.fa-regular.fa-star {
  color: #ccc;
}

.rating-text {
  font-size: 0.75rem;
  color: #888888;
  margin-left: 5px;
}

/* Giá tiền sản phẩm */
.product-price-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 20px;
  margin-top: auto; /* Đẩy giá và nút xuống đáy */
}

.current-price {
  font-size: 1.25rem;
  font-weight: 850;
  color: #ff3b30;
}

.original-price {
  font-size: 0.85rem;
  color: #a0a0a0;
  text-decoration: line-through;
}

/* Nút thêm vào giỏ */
.btn-add-cart {
  width: 100%;
  padding: 12px;
  background-color: #f4fbf6;
  border: 1px solid #e1ebe3;
  color: #4caf50;
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
  background-color: #4caf50;
  border-color: #4caf50;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.25);
}

/* ========================================================
   KHUNG NÚT XEM THÊM (CHUYỂN HƯỚNG SANG TRANG CỬA HÀNG)
   ======================================================== */
.show-more-wrapper {
  text-align: center;
  margin-top: 50px;
}

.btn-show-more {
  background-color: #ffffff;
  border: 2px solid #4caf50;
  color: #4caf50;
  padding: 12px 35px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.05);
}

.btn-show-more:hover {
  background-color: #4caf50;
  color: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
}

.btn-show-more i {
  font-size: 0.95rem;
  transition: transform 0.3s ease;
}

.btn-show-more:hover i {
  transform: translateX(5px); /* Đẩy nhẹ mũi tên sang phải khi hover */
}

/* ========================================================
   TOAST NOTIFICATION (THÔNG BÁO THÊM GIỎ HÀNG THÀNH CÔNG)
   ======================================================== */
.toast-notification {
  position: fixed;
  bottom: 30px;
  right: -450px; /* Ẩn mặc định bên ngoài màn hình */
  z-index: 9999;
  transition: right 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-notification.show {
  right: 30px; /* Trượt êm ái vào màn hình */
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
   RESPONSIVE
   ======================================================== */
@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr); /* 3 cột trên laptop nhỏ */
  }
}

@media (max-width: 992px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 cột trên máy tính bảng */
    gap: 20px;
  }
}

@media (max-width: 576px) {
  .products-grid {
    grid-template-columns: 1fr; /* 1 cột đứng hoàn toàn trên điện thoại */
    gap: 20px;
  }

  .product-image-box {
    height: 250px; /* Tăng chiều cao ảnh trên mobile cho rõ nét */
  }

  .main-title {
    font-size: 1.5rem;
  }

  .products-section {
    padding: 40px 0 60px;
  }
}
</style>
