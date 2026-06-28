<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const user = JSON.parse(localStorage.getItem("user"));
const CURRENT_USER_ID = user ? user.userId : null;

if (!CURRENT_USER_ID) {
  alert("Bạn chưa đăng nhập!");
  router.push("/dang-nhap");
}

// Dữ liệu form và giỏ hàng
const orderForm = ref({
  receiverName: "",
  receiverPhone: "",
  receiverAddress: "",
  note: "",
});
const cartItems = ref([]);
const shippingFee = computed(() => {
  if (!orderForm.value.receiverAddress) return 25000;
  
  // Logic: Nếu địa chỉ chứa "hà nội" hoặc "nội thành" thì phí 25k, còn lại 35k
  const address = orderForm.value.receiverAddress.toLowerCase();
  if (address.includes("hà nội") || address.includes("nội thành")) {
    return 25000;
  }
  return 35000;
});

const fetchCart = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/api/cart/${CURRENT_USER_ID}`);
    // Đảm bảo truy cập đúng vào cartDetails
    cartItems.value = res.data.cartDetails || []; 
    console.log("Giỏ hàng sau khi fetch:", cartItems.value);
  } catch (error) {
    console.error("Lỗi khi tải giỏ hàng:", error);
  }
};
const formatPrice = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const subTotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    const price = Number(item.product?.price || 0);
    const quantity = Number(item.quantity || 0);
    return total + price * quantity;
  }, 0);
});

const totalAmount = computed(() => subTotal.value + shippingFee.value);

const xacNhanDatHang = async () => {
  if (cartItems.value.length === 0) {
    alert("Giỏ hàng trống!");
    return;
  }

  try {
    const payload = {
      receiverName: orderForm.value.receiverName,
      receiverPhone: orderForm.value.receiverPhone,
      receiverAddress: orderForm.value.receiverAddress,
      note: orderForm.value.note,
      shippingFee: shippingFee.value, // Dùng giá trị tính toán tự động
      totalAmount: totalAmount.value 
    };

    const res = await axios.post(
      `http://localhost:8080/api/orders/${CURRENT_USER_ID}/checkout`,
      payload
    );
    
    cartItems.value = []; 
    alert("Đặt hàng thành công!");
    router.push("/"); 
  } catch (error) {
    console.error("Lỗi:", error.response?.data);
  }
};

onMounted(fetchCart);
</script>

<template>
  <div class="checkout-page">
    <div class="checkout-hero">
      <div class="container">
        <div class="breadcrumb">
          <RouterLink to="/">Trang chủ</RouterLink>
          <i class="fa fa-angle-right"></i>
          <RouterLink to="/cart">Giỏ hàng</RouterLink>
          <i class="fa fa-angle-right"></i>
          <span class="current-page">Thanh toán</span>
        </div>
        <h1>THÔNG TIN THANH TOÁN</h1>
      </div>
    </div>

    <div class="container checkout-layout">
      <div class="checkout-form-section">
        <h2>Thông tin giao hàng</h2>
        <form @submit.prevent="xacNhanDatHang">
          <div class="form-group">
            <label>Họ và tên *</label>
            <input
              v-model="orderForm.receiverName"
              type="text"
              placeholder="Nhập họ tên"
              required
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Số điện thoại *</label>
              <input
                v-model="orderForm.receiverPhone"
                type="tel"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" placeholder="Nhập email (không bắt buộc)" />
            </div>
          </div>
          <div class="form-group">
            <label>Địa chỉ nhận hàng *</label>
            <input
              v-model="orderForm.receiverAddress"
              type="text"
              placeholder="Địa chỉ..."
              required
            />
          </div>
          <div class="form-group">
            <label>Ghi chú đơn hàng</label>
            <textarea v-model="orderForm.note" rows="4"></textarea>
          </div>

          <h2 class="payment-title">Phương thức thanh toán</h2>
          <div class="payment-methods">
            <label class="method-option">
              <input type="radio" name="payment" checked />
              <span class="method-text">Thanh toán khi nhận hàng (COD)</span>
            </label>
            <label class="method-option">
              <input type="radio" name="payment" />
              <span class="method-text"
                >Chuyển khoản ngân hàng (Qua mã QR)</span
              >
            </label>
          </div>

          <button type="submit" class="btn-submit-order">
            XÁC NHẬN ĐẶT HÀNG
          </button>
        </form>
      </div>

      <div class="checkout-summary-section">
        <h2>Đơn hàng của bạn</h2>
        <div class="summary-card" v-if="cartItems.length > 0">
          <div class="summary-row">
            <span>Sản phẩm tạm tính</span>
            <strong>{{ formatPrice(subTotal) }}</strong>
          </div>
<div class="summary-row">
  <span>Phí vận chuyển</span>
  <span class="free-shipping">
    {{ formatPrice(shippingFee) }} 
    <small style="color: #888;">({{ shippingFee === 25000 ? 'Nội thành' : 'Ngoại thành' }})</small>
  </span>
</div>
          <hr class="summary-hr" />
          <div class="summary-row total-row">
            <span>Tổng thanh toán</span>
            <span class="total-price">{{ formatPrice(totalAmount) }}</span>
          </div>
        </div>
<div v-else class="summary-card">
  <p style="color: red;">Giỏ hàng của bạn đang trống!</p>
  <RouterLink to="/cua-hang">Quay lại mua sắm</RouterLink>
</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-page {
  background-color: #f9fbf9; /* Đổi sang nền xám trắng dịu của shop */
  color: #2c3e50; /* Chữ màu tối dễ đọc */
  min-height: 100vh;
  padding-bottom: 80px;
  font-family: Arial, sans-serif;
}
.checkout-hero {
  background: linear-gradient(
    135deg,
    #e8f5ec 0%,
    #ffffff 100%
  ); /* Nền gradient sáng giống cuaHang.vue */
  padding: 35px 0;
  border-bottom: 1px solid #e1ebe3;
  margin-bottom: 40px;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  margin-bottom: 12px;
}
.breadcrumb a {
  color: #5c6a60;
  text-decoration: none;
  font-weight: 600;
}
.breadcrumb a:hover {
  color: #4caf50;
}
.breadcrumb i {
  color: #888888;
  font-size: 0.7rem;
}
.breadcrumb .current-page {
  color: #4caf50;
  font-weight: 700;
}
.checkout-hero h1 {
  font-size: 1.8rem;
  color: #1a251e;
  margin: 0;
  font-weight: 850;
}

.checkout-layout {
  display: grid;
  grid-template-columns: 7fr 4fr;
  gap: 40px;
}
h2 {
  font-size: 1.25rem;
  color: #1a251e;
  border-left: 4px solid #4caf50;
  padding-left: 10px;
  margin-bottom: 25px;
  font-weight: 700;
}
.checkout-form-section {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  border: 1px solid #eef3ef;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
label {
  font-size: 0.9rem;
  color: #4a554d;
  font-weight: 600;
}
input,
textarea {
  padding: 12px;
  background-color: #ffffff;
  border: 1px solid #cedbd0;
  color: #2c3e50;
  border-radius: 6px;
  outline: none;
  transition: border 0.2s;
}
input:focus,
textarea:focus {
  border-color: #4caf50;
}

.payment-title {
  margin-top: 35px;
}
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
}
.method-option {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #fcfdfe;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid #cedbd0;
  transition: all 0.2s;
}
.method-option:hover {
  border-color: #4caf50;
  background-color: #f4fbf6;
}
.method-option input[type="radio"] {
  accent-color: #4caf50;
}
.method-text {
  font-size: 0.95rem;
  font-weight: 500;
  color: #2c3e50;
}

.btn-submit-order {
  width: 100%;
  padding: 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}
.btn-submit-order:hover {
  background-color: #45a049;
}

.checkout-summary-section .summary-card {
  background-color: #ffffff;
  border: 1px solid #eef3ef;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}
.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.95rem;
  color: #4a554d;
}
.free-shipping {
  color: #4caf50;
  font-weight: bold;
}
.summary-hr {
  border: none;
  border-top: 1px solid #eef3ef;
  margin: 15px 0;
}
.total-row {
  align-items: center;
  margin-bottom: 0;
  color: #1a251e;
}
.total-price {
  font-size: 1.4rem;
  color: #ff3b30;
  font-weight: 850;
}

@media (max-width: 768px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
