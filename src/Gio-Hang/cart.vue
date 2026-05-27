<script setup>
import { ref, computed } from 'vue'

// 1. Giả lập dữ liệu giỏ hàng (Sau này sẽ gọi API từ Spring Boot lấy từ bảng CartDetails)
const cartItems = ref([
  {
    id: 1,
    name: 'Bộ dao làm bếp cao cấp 5 món Thép Đức',
    category: 'Dao kéo',
    price: 1250000,
    quantity: 1,
    image: 'https://via.placeholder.com/80' // Thay bằng link ảnh thật sau
  },
  {
    id: 2,
    name: 'Chảo chống dính vân đá đáy từ 28cm',
    category: 'Nồi chảo',
    price: 450000,
    quantity: 2,
    image: 'https://via.placeholder.com/80'
  }
])

// 2. State quản lý khu vực giao hàng để tính phí ship
const shippingRegion = ref('noithan') // 'noithan' hoặc 'ngoaiand'

// 3. Tính toán tiền hàng (Tự động cập nhật khi thay đổi số lượng)
const subTotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

// 4. Tính phí ship: 25.000đ nội thành, 35.000đ ngoại thành theo nghiệp vụ của bạn
const shippingFee = computed(() => {
  if (cartItems.value.length === 0) return 0
  return shippingRegion.value === 'noithan' ? 25000 : 35000
})

// 5. Tổng tiền cuối cùng khách phải trả
const totalAmount = computed(() => {
  return subTotal.value + shippingFee.value
})

// 6. Các hàm xử lý tăng/giảm số lượng và xóa món đồ
const increaseQty = (item) => {
  item.quantity++
}

const decreaseQty = (item) => {
  if (item.quantity > 1) {
    item.quantity--
  }
}

const removeItem = (id) => {
  cartItems.value = cartItems.value.filter(item => item.id !== id)
}

// Hàm định dạng tiền tệ VND (Ví dụ: 450000 -> 450.000 đ)
const formatPrice = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}
</script>

<template>
  <div class="cart-page">
    <div class="cart-container">
      <h1 class="cart-title">GIỎ HÀNG CỦA BẠN</h1>

      <div v-if="cartItems.length === 0" class="empty-cart">
        <i class="fa fa-shopping-basket" aria-hidden="true"></i>
        <p>Giỏ hàng của bạn đang trống rỗng.</p>
        <a href="/" class="btn-back">TIẾP TỤC MUA SẮM</a>
      </div>

      <div v-else class="cart-content">
        
        <div class="cart-items-list">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="item-img">
              <img :src="item.image" :alt="item.name" />
            </div>
            
            <div class="item-details">
              <span class="item-cate">{{ item.category }}</span>
              <h3 class="item-name">{{ item.name }}</h3>
              <p class="item-price">{{ formatPrice(item.price) }}</p>
            </div>

            <div class="item-quantity">
              <button @click="decreaseQty(item)" class="qty-btn">-</button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button @click="increaseQty(item)" class="qty-btn">+</button>
            </div>

            <div class="item-total">
              {{ formatPrice(item.price * item.quantity) }}
            </div>

            <div class="item-delete">
              <button @click="removeItem(item.id)" class="delete-btn" title="Xóa khỏi giỏ">
                <i class="fa fa-trash" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="cart-summary">
          <h3>TÓM TẮT ĐƠN HÀNG</h3>
          <hr class="divider" />
          
          <div class="summary-row shipping-select-box">
            <label>Khu vực nhận hàng:</label>
            <select v-model="shippingRegion" class="shipping-select">
              <option value="noithan">Nội thành (Phí ship: 25.000đ)</option>
              <option value="ngoaiand">Ngoại thành (Phí ship: 35.000đ)</option>
            </select>
          </div>

          <div class="summary-row">
            <span>Tạm tính:</span>
            <span>{{ formatPrice(subTotal) }}</span>
          </div>
          
          <div class="summary-row">
            <span>Phí vận chuyển:</span>
            <span>{{ formatPrice(shippingFee) }}</span>
          </div>
          
          <hr class="divider" />
          
          <div class="summary-row total-row">
            <span>Tổng cộng:</span>
            <span class="total-price">{{ formatPrice(totalAmount) }}</span>
          </div>

          <button class="btn-checkout">
            TIẾN HÀNH THANH TOÁN <i class="fa fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  background-color: #000000;
  color: #ffffff;
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
  font-weight: 800;
  border-left: 4px solid #4CAF50;
  padding-left: 15px;
  margin-bottom: 30px;
  letter-spacing: 1px;
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
  background-color: #111111;
  border: 1px solid #222222;
  padding: 20px;
  border-radius: 12px;
  gap: 20px;
}

.item-img img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #333;
}

.item-details {
  flex: 2;
}

.item-cate {
  font-size: 0.75rem;
  color: #4CAF50;
  text-transform: uppercase;
  font-weight: bold;
}

.item-name {
  font-size: 1.05rem;
  margin: 5px 0;
  font-weight: 600;
}

.item-price {
  color: #888;
  font-size: 0.95rem;
}

/* Cụm tăng giảm số lượng */
.item-quantity {
  display: flex;
  align-items: center;
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 20px;
  padding: 2px;
}

.qty-btn {
  background: none;
  border: none;
  color: #fff;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  transition: color 0.2s;
}

.qty-btn:hover {
  color: #4CAF50;
}

.qty-value {
  padding: 0 10px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.item-total {
  flex: 1;
  text-align: right;
  font-weight: 700;
  color: #ffffff;
}

.delete-btn {
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  font-size: 1.1rem;
  transition: color 0.2s;
}

.delete-btn:hover {
  color: #ff3b30;
}

/* Khối tóm tắt hóa đơn bên phải */
.cart-summary {
  flex: 1;
  background-color: #111111;
  border: 1px solid #222222;
  border-radius: 12px;
  padding: 25px;
  position: sticky;
  top: 20px; /* Cuộn trang thì khối này sẽ ghim lại ở màn hình */
}

.cart-summary h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-top: 0;
}

.divider {
  border: 0;
  border-top: 1px solid #222222;
  margin: 15px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #aaa;
  font-size: 0.95rem;
}

.shipping-select-box {
  flex-direction: column;
  gap: 8px;
}

.shipping-select {
  background-color: #1a1a1a;
  border: 1px solid #333;
  color: #fff;
  padding: 10px;
  border-radius: 6px;
  outline: none;
  cursor: pointer;
}

.shipping-select:focus {
  border-color: #4CAF50;
}

.total-row {
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
}

.total-price {
  color: #4CAF50;
  font-size: 1.3rem;
  font-weight: 800;
}

.btn-checkout {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 25px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;
}

.btn-checkout:hover {
  background-color: #45a049;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
}

/* CSS khi giỏ hàng trống */
.empty-cart {
  text-align: center;
  padding: 60px 20px;
  background-color: #111111;
  border-radius: 12px;
  border: 1px solid #222222;
}

.empty-cart i {
  font-size: 3.5rem;
  color: #333;
  margin-bottom: 15px;
}

.empty-cart p {
  color: #888;
  margin-bottom: 25px;
}

.btn-back {
  display: inline-block;
  background-color: #1a1a1a;
  color: #fff;
  padding: 10px 25px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid #333;
  transition: all 0.2s;
}

.btn-back:hover {
  border-color: #4CAF50;
  color: #4CAF50;
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
}
</style>