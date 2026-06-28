<script setup>
import { ref, onMounted } from "vue"; // 1. Import onMounted
import { useRouter } from "vue-router";
import axios from "axios"; // 2. Import axios

const router = useRouter();
const products = ref([]); // 3. Khởi tạo mảng rỗng để chứa dữ liệu thật

// 4. Hàm lấy sản phẩm từ Backend
const fetchProducts = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/products");
    // Chỉ lấy 5 sản phẩm đầu tiên hoặc tùy ý bạn để làm "Sản phẩm bán chạy"
    products.value = res.data.slice(0, 5); 
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
  }
};

// 5. Gọi hàm ngay khi component được tải
onMounted(() => {
  fetchProducts();
});

// 2. ĐỊNH DẠNG TIỀN TỆ VND
const formatPrice = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

// 3. HỆ THỐNG TOAST THÔNG BÁO THÊM GIỎ HÀNG
const showToast = ref(false);
const toastMessage = ref("");

const addToCart = async (productId, productName) => {
  try {
    // Thay vì const CURRENT_USER_ID = 1;
const user = JSON.parse(localStorage.getItem("user"));
const CURRENT_USER_ID = user ? user.userId : null;
    await axios.post(`http://localhost:8080/api/cart/${CURRENT_USER_ID}/add`, {
      productId: productId,
      quantity: 1
    });

    toastMessage.value = `Đã thêm thành công "${productName}" vào giỏ hàng!`;
    showToast.value = true;
    setTimeout(() => (showToast.value = false), 2500);
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ:", error);
  }
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

// 5. CHUYỂN HƯỚNG SANG TRANG CỬA HÀNG
const goToShopPage = () => {
  router.push("/cua-hang");
};
</script>

<template>
  <section class="best-seller-section">
    <div class="container">
      <div class="section-header">
        <span class="sub-title">Được Yêu Thích Nhất</span>
        <h2 class="main-title">SẢN PHẨM BÁN CHẠY</h2>
        <div class="divider"></div>
      </div>

      <div class="products-grid">
        <div
          v-for="prod in products"
          :key="prod.productId"
          class="product-card"
        >
          <span v-if="prod.badge" class="product-badge">{{ prod.badge }}</span>

          <div class="product-image-box">
            <img
              :src="prod.imageUrl"
              :alt="prod.productName"
              class="product-img"
            />
            <div class="product-hover-actions">
              <button
                class="action-circle-btn"
                :class="{ 'is-favorite': favoriteIds.has(prod.productId) }"
                title="Yêu thích"
                @click="toggleFavorite(prod.productId)"
              >
                <i
                  :class="
                    favoriteIds.has(prod.productId)
                      ? 'fa-solid fa-heart'
                      : 'fa-regular fa-heart'
                  "
                ></i>
              </button>
            </div>
          </div>

          <div class="product-info-box">
                  <router-link :to="`/san-pham/${prod.productId}`" class="product-title-link">
                    <h3 class="product-title" :title="prod.productName">{{ prod.productName }}</h3>
                  </router-link>
            
            <div class="product-rating">
              <i
                v-for="star in 5"
                :key="star"
                class="fa-star"
                :class="star <= prod.rating ? 'fa-solid' : 'fa-regular'"
              ></i>
              <span class="rating-text">({{ prod.rating }}.0)</span>
            </div>

            <div class="product-price-row">
              <span class="current-price">{{ formatPrice(prod.price) }}</span>
              <span class="original-price" v-if="prod.originalPrice">
                {{ formatPrice(prod.originalPrice) }}
              </span>
            </div>

<button class="btn-add-cart" @click="addToCart(prod.productId, prod.productName)">
  <i class="fa-solid fa-cart-plus"></i>
  <span>Thêm vào giỏ</span>
</button>
          </div>
        </div>
      </div>

      <div class="show-more-wrapper">
        <button class="btn-show-more" @click="goToShopPage">
          <span>Khám Phá Thêm Dụng Cụ</span>
          <i class="fa-solid fa-arrow-right-long"></i>
        </button>
      </div>
    </div>

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
  color: #ffb400; /* Đổi sub-title sang màu vàng đồng cho hợp với chữ Bán Chạy */
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

/* ĐỔI MÀU NỀN SANG TRẮNG ĐỂ XEN KẼ VỚI PHẦN SẢN PHẨM NỔI BẬT */
.best-seller-section {
  padding: 30px 0 40px;
  background-color: #ffffff; 
}

/* LƯỚI SẢN PHẨM */
.products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 30px;
}

/* THẺ SẢN PHẨM */
.product-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #eef3ef;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.08);
  border-color: #cedbd0;
}

/* Nhãn sản phẩm (Badge) - Đổi sang màu vàng cam */
.product-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: #ff9500; 
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  z-index: 5;
  box-shadow: 0 2px 6px rgba(255, 149, 0, 0.3);
}

.product-image-box {
  width: 100%;
  height: 230px;
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
  font-size: 1.25rem;
  font-weight: 850;
  color: #ff3b30;
}

.original-price {
  font-size: 0.85rem;
  color: #a0a0a0;
  text-decoration: line-through;
}

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
  transform: translateX(5px);
}

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

@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 992px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}
@media (max-width: 576px) {
  .products-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .product-image-box {
    height: 250px;
  }
  .main-title {
    font-size: 1.5rem;
  }
  .best-seller-section {
    padding: 40px 0 60px;
  }
}
</style>