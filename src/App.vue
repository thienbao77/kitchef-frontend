<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
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
  <topHeader></topHeader>
  <underHeader></underHeader>
  <div>
    <div class="connection-status-bar" :class="{ connected: connected }">
      <span class="status-dot"></span>
      <span class="status-text">{{ tinNhanBackend }}</span>
    </div>

    <!-- 🖥️ Nơi hiển thị nội dung của trang hiện tại (Trang chủ, Đăng ký hoặc Đăng nhập) do Router quản lý -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Không cần viết gì ở đây cả */
</style>
