<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
// Import RouterView một cách tường minh để đảm bảo Vue nhận diện được linh hồn của Router
import { RouterView } from "vue-router"; 

import topHeader from "./components/top-header.vue";
import underHeader from "./components/under-header.vue";

// Biến hứng thông điệp từ Spring Boot gửi sang
const tinNhanBackend = ref("Đang bấm máy gọi sang tổng đài Spring Boot...");
const connected = ref(false); // Trạng thái kết nối thành công hay chưa

onMounted(async () => {
  try {
    // 🚚 Axios chạy sang cổng 8080 của Java để xin dữ liệu
    const response = await axios.get("http://localhost:8080/api/test");

    // Nếu Java trả lời, đổi chữ trên màn hình và chuyển trạng thái thành công
    tinNhanBackend.value = response.data;
    connected.value = true;
  } catch (error) {
    // Nếu lỗi (Chưa bật IntelliJ, quên cắm CORS...), hiện thông báo lỗi
    tinNhanBackend.value =
      "Kết nối thất bại! Hãy chắc chắn bạn đã RUN dự án Spring Boot ở cổng 8080.";
    connected.value = false;

    // 👇 Sửa lỗi từ System.err.println sang console.error của JavaScript
    console.error(error);
  }
});
</script>

<template>
  <div id="layout-wrapper">
    
    <topHeader />
    <underHeader />

    <div class="connection-status-bar" :class="{ connected: connected }">
      <span class="status-dot"></span>
      <span class="status-text">{{ tinNhanBackend }}</span>
    </div>

    <main class="main-content">
      <RouterView />
    </main>

  </div>
</template>

<style scoped>
/* Thêm một chút CSS cơ bản để thanh trạng thái kết nối không đè vỡ giao diện của bạn */
#layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #000000;
}

.connection-status-bar {
  padding: 8px 20px;
  background-color: #721c24; /* Mặc định màu đỏ đô khi mất kết nối */
  color: #f8d7da;
  font-size: 0.85rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
}

/* Khi kết nối thành công với Spring Boot, tự chuyển sang nền xanh lá đen dịu mắt */
.connection-status-bar.connected {
  background-color: #155724;
  color: #d4edda;
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: #ff3b30;
  border-radius: 50%;
  display: inline-block;
}

.connection-status-bar.connected .status-dot {
  background-color: #4CAF50; /* Chấm tròn chuyển xanh */
}

.main-content {
  flex: 1; /* Đảm bảo nội dung trang chiếm trọn không gian còn lại */
  width: 100%;
}
</style>