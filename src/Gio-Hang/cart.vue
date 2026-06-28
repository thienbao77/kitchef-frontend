<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { RouterLink } from "vue-router";

// 1. Dữ liệu thật từ Backend
const cartItems = ref([]);

const user = JSON.parse(localStorage.getItem("user"));
const CURRENT_USER_ID = user ? user.userId : null;
const userName = user ? user.fullName : "Khách"; // Lấy tên người dùng

// Thêm kiểm tra an toàn
if (!CURRENT_USER_ID) {
  console.warn("Chưa đăng nhập!");
}

// 2. Hàm lấy giỏ hàng từ API
const fetchCart = async () => {
  try {
    // Gọi API lấy giỏ hàng của user
    const res = await axios.get(
      `http://localhost:8080/api/cart/${CURRENT_USER_ID}`,
    );
    // Gán dữ liệu (res.data.cartDetails là danh sách chi tiết giỏ hàng)
    cartItems.value = res.data.cartDetails || [];
  } catch (error) {
    console.error("Lỗi khi tải giỏ hàng:", error);
  }
};

// 3. Các hàm xử lý tăng/giảm và xóa qua API
const increaseQty = async (item) => {
  const newQty = item.quantity + 1;
  await axios.put(
    `http://localhost:8080/api/cart/update/${item.cartDetailId}`,
    newQty,
  );
  item.quantity = newQty;
};

const decreaseQty = async (item) => {
  if (item.quantity > 1) {
    const newQty = item.quantity - 1;
    await axios.put(
      `http://localhost:8080/api/cart/update/${item.cartDetailId}`,
      newQty,
    );
    item.quantity = newQty;
  }
};

const removeItem = async (cartDetailId) => {
  await axios.delete(`http://localhost:8080/api/cart/remove/${cartDetailId}`);
  cartItems.value = cartItems.value.filter(
    (item) => item.cartDetailId !== cartDetailId,
  );
};

// Tính toán tiền
const subTotal = computed(() => {
  return cartItems.value.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
});
const totalAmount = computed(() => subTotal.value);

const formatPrice = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

onMounted(fetchCart);
</script>

<template>
  <div class="cart-page">
    <div class="cart-container">
      <h1 class="cart-title">GIỎ HÀNG CỦA {{ userName.toUpperCase() }}</h1>

      <div v-if="cartItems.length === 0" class="empty-cart">
        <span class="empty-cart-icon">🛒</span>
        <p>Giỏ hàng của bạn đang trống rỗng.</p>
        <RouterLink to="/cua-hang" class="btn-back"
          >TIẾP TỤC MUA SẮM</RouterLink
        >
      </div>

      <div v-else class="cart-content">
        <div class="cart-items-list">
          <div
            v-for="item in cartItems"
            :key="item.cartDetailId"
            class="cart-item"
          >
            <div class="item-img">
              <img
                :src="item.product.imageUrl"
                :alt="item.product.productName"
              />
            </div>

            <div class="item-details">
              <span class="item-cate">{{
                item.product.category?.categoryName
              }}</span>
              <h3 class="item-name">{{ item.product.productName }}</h3>
              <p class="item-price">{{ formatPrice(item.product.price) }}</p>
            </div>

            <div class="item-quantity">
              <button @click="decreaseQty(item)" class="qty-btn">-</button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button @click="increaseQty(item)" class="qty-btn">+</button>
            </div>

            <div class="item-total">
              {{ formatPrice(item.product.price * item.quantity) }}
            </div>

            <div class="item-delete">
              <button @click="removeItem(item.cartDetailId)" class="delete-btn">
                <span class="delete-icon">✕</span>
                <span class="delete-text">Xóa</span>
              </button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <h3>Tóm tắt đơn hàng</h3>
          <hr class="divider" />

          <div class="summary-row">
            <span>Tạm tính:</span>
            <span class="summary-value">{{ formatPrice(subTotal) }}</span>
          </div>
          <div class="summary-row">
            <span>Phí vận chuyển:</span>
            <span style="font-size: 0.8rem; color: #888"
              >(Tính tại bước thanh toán)</span
            >
          </div>

          <hr class="divider" />

          <div class="summary-row total-row">
            <span>Tổng cộng:</span>
            <span class="total-price">{{ formatPrice(totalAmount) }}</span>
          </div>

          <RouterLink to="/thanh-toan" class="btn-checkout">
            THANH TOÁN ĐƠN HÀNG
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  background-color: #f9fbf9; /* Nền xám trắng sáng đồng bộ */
  color: #2c3e50; /* Chữ màu tối dễ đọc */
  min-height: 100vh;
  padding: 40px 20px;
  font-family: "Segoe UI", Roboto, sans-serif;
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
}

.cart-title {
  font-size: 1.8rem;
  font-weight: 850;
  color: #1a251e;
  border-left: 4px solid #4caf50;
  padding-left: 15px;
  margin-bottom: 30px;
  letter-spacing: 0.5px;
}

/* Giao diện chia 2 cột bằng Flexbox */
.cart-content {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

/* Khối danh sách sản phẩm */
.cart-items-list {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: flex;
  align-items: center;
  background-color: #ffffff; /* Thẻ sản phẩm nền trắng */
  border: 1px solid #eef3ef;
  padding: 20px;
  border-radius: 12px;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
}

.item-img img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #cedbd0;
}

.item-details {
  flex: 2;
}

.item-cate {
  font-size: 0.75rem;
  color: #4caf50;
  text-transform: uppercase;
  font-weight: 700;
}

.item-name {
  font-size: 1.05rem;
  margin: 5px 0;
  font-weight: 700;
  color: #1a251e;
}

.item-price {
  color: #5c6a60;
  font-size: 0.95rem;
}

/* Cụm tăng giảm số lượng */
.item-quantity {
  display: flex;
  align-items: center;
  background-color: #f4fbf6;
  border: 1px solid #cedbd0;
  border-radius: 20px;
  padding: 2px;
}

.qty-btn {
  background: none;
  border: none;
  color: #2c3e50;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  transition: color 0.2s;
}

.qty-btn:hover {
  color: #4caf50;
}

.qty-value {
  padding: 0 10px;
  font-weight: 700;
  min-width: 20px;
  text-align: center;
  color: #1a251e;
}

.item-total {
  flex: 1;
  text-align: right;
  font-weight: 850;
  color: #ff3b30; /* Giá tiền nổi bật */
}

/* NÚT XÓA SẢN PHẨM */
.delete-btn {
  background-color: #ffffff;
  border: 1px solid #cedbd0;
  color: #5c6a60;
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background-color: #ff3b30;
  border-color: #ff3b30;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(255, 59, 48, 0.15);
}

.delete-icon {
  font-size: 0.9rem;
}

/* Khối tóm tắt hóa đơn bên phải */
.cart-summary {
  flex: 1;
  background-color: #ffffff;
  border: 1px solid #eef3ef;
  border-radius: 12px;
  padding: 25px;
  position: sticky;
  top: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
}

.cart-summary h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-top: 0;
  color: #1a251e;
}

.divider {
  border: 0;
  border-top: 1px solid #eef3ef;
  margin: 15px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #4a554d;
  font-size: 0.95rem;
  font-weight: 600;
}

.summary-value {
  color: #2c3e50;
  font-weight: 700;
}

.shipping-select-box {
  flex-direction: column;
  gap: 8px;
}

.shipping-select {
  background-color: #ffffff;
  border: 1px solid #cedbd0;
  color: #2c3e50;
  padding: 10px;
  border-radius: 6px;
  outline: none;
  cursor: pointer;
  font-weight: 500;
}

.shipping-select:focus {
  border-color: #4caf50;
}

.total-row {
  color: #1a251e;
  font-weight: 700;
  font-size: 1.1rem;
}

.total-price {
  color: #ff3b30;
  font-size: 1.3rem;
  font-weight: 850;
}

/* 🌟 CẤU HÌNH NÚT THANH TOÁN MỚI - CHỐNG GẠCH CHÂN VÀ MÀU TÍM */
.btn-checkout {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #4caf50;
  color: #ffffff !important; /* Ép buộc luôn là màu trắng, không lo bị hóa tím */
  text-decoration: none !important; /* Xóa bỏ hoàn toàn gạch chân liên kết */
  padding: 14px 0;
  border-radius: 25px;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  margin-top: 15px;
  box-sizing: border-box;
  transition: all 0.3s;
}

.btn-checkout:hover {
  background-color: #45a049;
  color: #ffffff !important;
  text-decoration: none !important;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

/* CSS khi giỏ hàng trống */
.empty-cart {
  text-align: center;
  padding: 60px 20px;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #eef3ef;
}

.empty-cart-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 15px;
}

.empty-cart p {
  color: #5c6a60;
  margin-bottom: 25px;
  font-weight: 500;
}

.btn-back {
  display: inline-block;
  background-color: #f4fbf6;
  color: #4caf50;
  padding: 10px 25px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  border: 1px solid #cedbd0;
  transition: all 0.2s;
}

.btn-back:hover {
  background-color: #4caf50;
  color: white;
  border-color: #4caf50;
}

/* Responsive di động */
@media (max-width: 992px) {
  .cart-content {
    flex-direction: column;
  }

  .cart-summary {
    width: 100%;
    box-sizing: border-box;
  }
}

@media (max-width: 576px) {
  .cart-item {
    flex-direction: column;
    text-align: center;
  }

  .item-total {
    text-align: center;
  }

  .delete-text {
    display: none;
  }

  .delete-btn {
    padding: 8px 10px;
  }
}
</style>
