<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const order = ref(null)

onMounted(async () => {
  const orderId = route.query.orderId
  // Bạn cần một API GET /api/orders/{orderId} trong OrderController
  const res = await axios.get(`http://localhost:8080/api/orders/${orderId}`)
  order.value = res.data
})

const formatPrice = (value) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
};
</script>

<template>
  <div class="invoice-page">
    <div class="container invoice-container">
      <div class="success-icon-box">
        <div class="success-icon">✓</div>
      </div>
      
      <h1 class="success-title">ĐẶT HÀNG THÀNH CÔNG!</h1>
      <p class="success-subtitle">Cảm ơn bạn đã lựa chọn KitChef. Mã đơn hàng của bạn là: <strong>#KC-202699</strong></p>

<div class="invoice-card" v-if="order">
  <div class="customer-info" style="text-align: left; margin-bottom: 20px;">
    <p>Khách hàng: <strong>{{ order.customerName }}</strong></p>
    <p>Địa chỉ nhận: <strong>{{ order.receiverAddress }}</strong></p>
    <p>Số điện thoại: <strong>{{ order.receiverPhone }}</strong></p>
  </div>
  
  <table class="invoice-table">
    <thead>
      <tr>
        <th>Tên sản phẩm</th>
        <th class="text-center">Số lượng</th>
        <th class="text-right">Thành tiền</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in order.orderDetails" :key="item.orderDetailId">
        <td>{{ item.productName }}</td>
        <td class="text-center">{{ item.quantity }}</td>
        <td class="text-right">{{ formatPrice(item.price * item.quantity) }}</td>
      </tr>
    </tbody>
  </table>
  </div>

      <div class="action-buttons">
        <RouterLink to="/cua-hang" class="btn-action btn-continue">TIẾP TỤC MUA SẮM</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.invoice-page {
  background-color: #f9fbf9;
  color: #2c3e50;
  min-height: 100vh;
  padding: 60px 0;
  font-family: Arial, sans-serif;
}
.invoice-container { max-width: 750px; text-align: center; }

.success-icon-box { display: flex; justify-content: center; margin-bottom: 20px; }
.success-icon {
  width: 75px;
  height: 75px;
  background-color: #4caf50;
  color: white;
  border-radius: 50%;
  font-size: 2.5rem;
  line-height: 75px;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.2);
}
.success-title { color: #4caf50; font-size: 2rem; font-weight: 850; margin-bottom: 10px; }
.success-subtitle { color: #5c6a60; font-size: 1.05rem; margin-bottom: 40px; }

/* Thẻ hóa đơn nền trắng sạch sẽ */
.invoice-card {
  background-color: #ffffff;
  border: 1px solid #eef3ef;
  border-radius: 12px;
  padding: 35px;
  text-align: left;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
}
.invoice-header { display: flex; justify-content: space-between; align-items: center; }
.brand { font-size: 1.5rem; font-weight: 850; color: #1a251e; }
.highlight { color: #4caf50; }
.invoice-date { color: #888888; font-size: 0.9rem; }
.invoice-hr { border: none; border-top: 1px solid #eef3ef; margin: 20px 0; }

.invoice-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
.invoice-info-grid h3 { font-size: 1rem; color: #1a251e; margin-bottom: 12px; font-weight: 700; }
.invoice-info-grid p { font-size: 0.9rem; color: #4a554d; margin: 5px 0; }
.badge-pending { background-color: #e67e22; color: white; padding: 3px 10px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; }

.invoice-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
.invoice-table th { background-color: #f4fbf6; color: #2c3e50; padding: 12px; font-size: 0.9rem; font-weight: 700; border-top: 1px solid #eef3ef; border-bottom: 1px solid #eef3ef; }
.invoice-table td { padding: 15px 12px; border-bottom: 1px solid #eef3ef; font-size: 0.9rem; color: #2c3e50; }

.invoice-footer-total { width: 280px; margin-left: auto; margin-top: 30px; }
.total-line { display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 10px; color: #4a554d; }
.final-total { font-size: 1.05rem; color: #1a251e; font-weight: 700; align-items: center; }
.final-total .price { color: #ff3b30; font-size: 1.4rem; font-weight: 850; }

.text-right { text-align: right; }
.text-center { text-align: center; }

.action-buttons { margin-top: 40px; }
.btn-action {
  display: inline-block;
  padding: 14px 40px;
  background-color: #4caf50;
  color: white;
  text-decoration: none;
  font-weight: 700;
  border-radius: 8px;
  transition: background 0.3s;
}
.btn-action:hover { background-color: #45a049; }
</style>