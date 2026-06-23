<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// ========================================================
// 1. DỮ LIỆU GIẢ LẬP SẢN PHẨM (Mô phỏng gọi API qua Slug)
// ========================================================
// Sau này bạn sẽ dùng axios.get(`/api/products/${route.params.slug}`) để lấy cục data này
const product = ref({
  product_id: 1,
  category_id: 1,
  category_name: "Nồi, Chảo",
  product_name: "Nồi Gang Tráng Men KitChef Đỏ Cherry 24cm",
  slug: "noi-gang-trang-men-kitchef-do",
  price: 2450000,
  stock_quantity: 15,
  description: `Nồi gang cao cấp tráng men đa lớp giữ nhiệt hoàn hảo, chuyên dùng cho các món ninh, hầm, kho. 
  <br><br><strong>Tính năng nổi bật:</strong>
  <ul>
    <li>Chất liệu gang đúc nguyên khối, truyền và giữ nhiệt vượt trội.</li>
    <li>Lớp men chống dính cao cấp từ Pháp, an toàn 100% cho sức khỏe.</li>
    <li>Sử dụng được trên mọi loại bếp, kể cả bếp từ và lò nướng (lên đến 260°C).</li>
    <li>Thiết kế sang trọng, có thể đặt thẳng lên bàn ăn.</li>
  </ul>`,
  image_url:
    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",

  // Dữ liệu từ bảng ProductImages
  extra_images: [
    {
      image_id: 1,
      image_url:
        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",
      display_order: 1,
    }, // Ảnh chính lấy làm gốc
    {
      image_id: 2,
      image_url:
        "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
      display_order: 2,
    },
    {
      image_id: 3,
      image_url:
        "https://images.unsplash.com/photo-1622397193214-386d38faee78?auto=format&fit=crop&w=800&q=80",
      display_order: 3,
    },
  ],
});

// Dữ liệu Đánh giá/Bình luận giả lập (Bảng Reviews)
const reviews = ref([
  {
    id: 1,
    customer_name: "Minh Thư",
    rating: 5,
    comment:
      "Nồi rất nặng tay, màu đỏ bên ngoài nhìn sang cực kỳ. Đã hầm thử thịt bò rất nhanh mềm.",
    date: "2026-05-20",
  },
  {
    id: 2,
    customer_name: "Lê Tuấn",
    rating: 4,
    comment:
      "Chất lượng tốt nhưng giao hàng hơi lâu một chút. Đóng gói cẩn thận.",
    date: "2026-05-18",
  },
]);

// ========================================================
// 2. LOGIC TƯƠNG TÁC GIAO DIỆN
// ========================================================
// Quản lý ảnh đang xem
const currentMainImage = ref("");
onMounted(() => {
  currentMainImage.value = product.value.image_url;
});
const changeMainImage = (url) => {
  currentMainImage.value = url;
};

// Quản lý số lượng mua
const orderQuantity = ref(1);
const increaseQty = () => {
  if (orderQuantity.value < product.value.stock_quantity) orderQuantity.value++;
};
const decreaseQty = () => {
  if (orderQuantity.value > 1) orderQuantity.value--;
};

// Format Tiền tệ
const formatPrice = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

// Quản lý Tabs
const activeTab = ref("description"); // 'description' hoặc 'reviews'

// Hệ thống Thông báo (Toast)
const showToast = ref(false);
const toastMsg = ref("");
const addToCart = () => {
  toastMsg.value = `Đã thêm ${orderQuantity.value} "${product.value.product_name}" vào giỏ hàng.`;
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
};
</script>

<template>
  <div class="product-detail-page">
    <div class="container">
      <nav class="breadcrumb">
        <router-link to="/">Trang chủ</router-link>
        <i class="fa-solid fa-angle-right"></i>
        <router-link to="/cua-hang">{{ product.category_name }}</router-link>
        <i class="fa-solid fa-angle-right"></i>
        <span class="current-page">{{ product.product_name }}</span>
      </nav>

      <div class="product-main-grid">
        <div class="product-gallery">
          <div class="main-image-box">
            <img
              :src="currentMainImage"
              :alt="product.product_name"
              class="main-img"
            />
          </div>
          <div
            class="thumbnail-list"
            v-if="product.extra_images && product.extra_images.length > 0"
          >
            <div
              v-for="img in product.extra_images"
              :key="img.image_id"
              class="thumb-item"
              :class="{ active: currentMainImage === img.image_url }"
              @click="changeMainImage(img.image_url)"
            >
              <img :src="img.image_url" alt="thumbnail" />
            </div>
          </div>
        </div>

        <div class="product-info-panel">
          <div class="product-header">
            <span class="product-category-tag">{{
              product.category_name
            }}</span>
            <h1 class="product-title">{{ product.product_name }}</h1>

            <div class="product-meta">
              <div class="rating-stars">
                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i
                ><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i
                ><i class="fa-solid fa-star"></i>
                <span>(12 Đánh giá)</span>
              </div>
              <div class="stock-status">
                <i
                  class="fa-solid fa-circle-check"
                  v-if="product.stock_quantity > 0"
                ></i>
                <i
                  class="fa-solid fa-circle-xmark"
                  style="color: #ff3b30"
                  v-else
                ></i>
                <span
                  :class="
                    product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'
                  "
                >
                  {{
                    product.stock_quantity > 0
                      ? `Còn hàng (${product.stock_quantity} sản phẩm)`
                      : "Tạm hết hàng"
                  }}
                </span>
              </div>
            </div>
          </div>

          <div class="product-price-box">
            <span class="price-current">{{ formatPrice(product.price) }}</span>
          </div>

          <div class="purchase-actions" v-if="product.stock_quantity > 0">
            <div class="quantity-selector">
              <span class="qty-label">Số lượng:</span>
              <div class="qty-controls">
                <button class="btn-qty" @click="decreaseQty">-</button>
                <input
                  type="number"
                  v-model="orderQuantity"
                  readonly
                  class="input-qty"
                />
                <button class="btn-qty" @click="increaseQty">+</button>
              </div>
            </div>

            <div class="action-buttons">
              <button class="btn-add-to-cart" @click="addToCart">
                <i class="fa-solid fa-cart-plus"></i> Thêm Vào Giỏ Hàng
              </button>
              <button class="btn-buy-now">Mua Ngay</button>
            </div>
          </div>

          <div class="out-of-stock-alert" v-else>
            <i class="fa-solid fa-bell"></i> Sản phẩm này hiện đang tạm hết
            hàng. Vui lòng quay lại sau!
          </div>

          <div class="store-promises">
            <div class="promise-item">
              <i class="fa-solid fa-shield-halved"></i> Bảo hành chính hãng 12
              tháng
            </div>
            <div class="promise-item">
              <i class="fa-solid fa-truck-fast"></i> Miễn phí giao hàng toàn
              quốc
            </div>
            <div class="promise-item">
              <i class="fa-solid fa-rotate-left"></i> Đổi trả trong vòng 7 ngày
            </div>
          </div>
        </div>
      </div>

      <div class="product-tabs-section">
        <div class="tabs-header">
          <button
            :class="{ active: activeTab === 'description' }"
            @click="activeTab = 'description'"
          >
            Mô Tả Sản Phẩm
          </button>
          <button
            :class="{ active: activeTab === 'reviews' }"
            @click="activeTab = 'reviews'"
          >
            Khách Hàng Đánh Giá ({{ reviews.length }})
          </button>
        </div>

        <div class="tabs-content">
          <div class="tab-pane fade-in" v-if="activeTab === 'description'">
            <div class="description-html" v-html="product.description"></div>
          </div>

          <div class="tab-pane fade-in" v-if="activeTab === 'reviews'">
            <div class="reviews-container">
              <div class="write-review-box">
                <h4>Gửi đánh giá của bạn</h4>
                <div class="rating-select">
                  <span>Bạn chấm mấy sao? </span>
                  <i class="fa-regular fa-star"></i
                  ><i class="fa-regular fa-star"></i
                  ><i class="fa-regular fa-star"></i
                  ><i class="fa-regular fa-star"></i
                  ><i class="fa-regular fa-star"></i>
                </div>
                <textarea
                  rows="3"
                  placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                ></textarea>
                <button class="btn-submit-review">Gửi Đánh Giá</button>
              </div>

              <div class="reviews-list">
                <div class="review-item" v-for="rev in reviews" :key="rev.id">
                  <div class="reviewer-avatar">
                    {{ rev.customer_name.charAt(0) }}
                  </div>
                  <div class="review-details">
                    <div class="review-meta">
                      <span class="reviewer-name">{{ rev.customer_name }}</span>
                      <span class="review-date">{{ rev.date }}</span>
                    </div>
                    <div class="review-stars">
                      <i
                        class="fa-solid fa-star"
                        v-for="s in rev.rating"
                        :key="'s' + s"
                      ></i>
                      <i
                        class="fa-regular fa-star"
                        v-for="r in 5 - rev.rating"
                        :key="'r' + r"
                      ></i>
                    </div>
                    <p class="review-text">{{ rev.comment }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="toast-notification" :class="{ show: showToast }">
      <div class="toast-content">
        <i class="fa-solid fa-circle-check toast-icon"></i>
        <span class="toast-msg">{{ toastMsg }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========================================================
   CẤU TRÚC TỔNG THỂ
   ======================================================== */
.product-detail-page {
  background-color: #f9fbf9;
  padding: 30px 0 60px 0;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 1. BREADCRUMB */
.breadcrumb {
  font-size: 0.9rem;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
}
.breadcrumb a {
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}
.breadcrumb a:hover {
  color: #4caf50;
}
.breadcrumb i {
  font-size: 0.7rem;
  color: #aaa;
}
.current-page {
  color: #1a251e;
  font-weight: 600;
}

/* 2. GRID 2 CỘT CHÍNH */
.product-main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 50px;
  background-color: #ffffff;
  padding: 40px;
  border-radius: 12px;
  border: 1px solid #eef3ef;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.02);
}

/* Cột Trái: Ảnh (Gallery) */
.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.main-image-box {
  width: 100%;
  height: 450px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eef3ef;
  background-color: #fafafa;
}
.main-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.thumbnail-list {
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding-bottom: 5px;
}
.thumb-item {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  overflow: hidden;
  opacity: 0.7;
  transition: all 0.2s;
}
.thumb-item:hover {
  opacity: 1;
}
.thumb-item.active {
  border-color: #4caf50;
  opacity: 1;
}
.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Cột Phải: Thông tin */
.product-info-panel {
  display: flex;
  flex-direction: column;
}
.product-category-tag {
  font-size: 0.85rem;
  color: #4caf50;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
  display: inline-block;
}
.product-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a251e;
  margin: 0 0 15px 0;
  line-height: 1.3;
}
.product-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
  font-size: 0.9rem;
}
.rating-stars {
  color: #ffb400;
  display: flex;
  align-items: center;
  gap: 5px;
}
.rating-stars span {
  color: #888;
  margin-left: 5px;
}
.stock-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}
.in-stock {
  color: #4caf50;
}
.out-of-stock {
  color: #ff3b30;
}

.product-price-box {
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px dashed #eef3ef;
}
.price-current {
  font-size: 2.2rem;
  font-weight: 800;
  color: #ff3b30;
}

.purchase-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
}
.quantity-selector {
  display: flex;
  align-items: center;
  gap: 15px;
}
.qty-label {
  font-weight: 600;
  color: #2c3e50;
}
.qty-controls {
  display: flex;
  align-items: center;
  border: 1px solid #cedbd0;
  border-radius: 6px;
  overflow: hidden;
  width: max-content;
}
.btn-qty {
  width: 40px;
  height: 40px;
  background-color: #f9fbf9;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #4a554f;
  transition: background 0.2s;
}
.btn-qty:hover {
  background-color: #e1ebe3;
}
.input-qty {
  width: 50px;
  height: 40px;
  border: none;
  border-left: 1px solid #cedbd0;
  border-right: 1px solid #cedbd0;
  text-align: center;
  font-weight: 700;
  font-size: 1rem;
  color: #1a251e;
  pointer-events: none;
}

.action-buttons {
  display: flex;
  gap: 15px;
}
.btn-add-to-cart {
  flex: 1;
  padding: 15px;
  background-color: #e8f5ec;
  border: 1px solid #4caf50;
  color: #4caf50;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-add-to-cart:hover {
  background-color: #4caf50;
  color: white;
}
.btn-buy-now {
  flex: 1;
  padding: 15px;
  background-color: #ff3b30;
  border: none;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 59, 48, 0.2);
}
.btn-buy-now:hover {
  background-color: #e6352b;
  transform: translateY(-2px);
}

.out-of-stock-alert {
  background-color: #fff0eb;
  color: #ff3b30;
  padding: 15px;
  border-radius: 8px;
  font-weight: 600;
  margin-bottom: 30px;
  border: 1px solid #ffe0cc;
}

.store-promises {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #f9fbf9;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #eef3ef;
}
.promise-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a554f;
}
.promise-item i {
  color: #4caf50;
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

/* 3. TABS (MÔ TẢ & ĐÁNH GIÁ) */
.product-tabs-section {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #eef3ef;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.02);
}
.tabs-header {
  display: flex;
  border-bottom: 1px solid #eef3ef;
  background-color: #f9fbf9;
}
.tabs-header button {
  flex: 1;
  padding: 20px;
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: 700;
  color: #888;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}
.tabs-header button.active {
  color: #4caf50;
  background-color: #ffffff;
}
.tabs-header button.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #4caf50;
}

.tabs-content {
  padding: 40px;
}
.description-html {
  font-size: 1rem;
  line-height: 1.8;
  color: #4a554f;
}
.description-html ul {
  padding-left: 20px;
  margin-top: 10px;
}
.description-html li {
  margin-bottom: 10px;
}

/* BÌNH LUẬN */
.reviews-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.write-review-box {
  background-color: #f9fbf9;
  padding: 25px;
  border-radius: 8px;
  border: 1px solid #eef3ef;
}
.write-review-box h4 {
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  color: #1a251e;
}
.rating-select {
  margin-bottom: 15px;
  color: #ffb400;
  font-size: 1.2rem;
  cursor: pointer;
}
.rating-select span {
  font-size: 0.95rem;
  color: #666;
  margin-right: 10px;
}
.write-review-box textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #cedbd0;
  border-radius: 6px;
  font-family: inherit;
  margin-bottom: 15px;
  resize: vertical;
  box-sizing: border-box;
}
.btn-submit-review {
  background-color: #1a251e;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.review-item {
  display: flex;
  gap: 20px;
  border-bottom: 1px solid #eef3ef;
  padding-bottom: 25px;
}
.review-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.reviewer-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: #e8f5ec;
  color: #4caf50;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.2rem;
}
.review-details {
  flex: 1;
}
.review-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}
.reviewer-name {
  font-weight: 700;
  color: #1a251e;
}
.review-date {
  font-size: 0.85rem;
  color: #888;
}
.review-stars {
  color: #ffb400;
  font-size: 0.85rem;
  margin-bottom: 10px;
}
.review-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #4a554f;
}

/* TOAST */
.toast-notification {
  position: fixed;
  bottom: 30px;
  right: -450px;
  z-index: 9999;
  transition: right 0.4s ease;
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

/* RESPONSIVE */
@media (max-width: 992px) {
  .product-main-grid {
    grid-template-columns: 1fr;
  }
  .main-image-box {
    height: 400px;
  }
}
@media (max-width: 576px) {
  .product-main-grid {
    padding: 20px;
  }
  .action-buttons {
    flex-direction: column;
  }
  .tabs-header button {
    font-size: 0.9rem;
    padding: 15px 10px;
  }
  .tabs-content {
    padding: 20px;
  }
}
</style>
