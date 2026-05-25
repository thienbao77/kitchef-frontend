<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

import DangKy from "./views/dangky.vue";
import dangNhap from "./views/dangNhap.vue";
import DangNhap from "./views/dangNhap.vue";

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
    System.err.println(error);
  }
});
</script>

<template>
  <DangKy />
  <DangNhap />

  <div
    style="
      text-align: center;
      margin-top: 100px;
      font-family: &quot;Segoe UI&quot;, Tahoma, Geneva, Verdana, sans-serif;
    "
  >
    <h1 style="color: #42b883; font-size: 2.5rem; margin-bottom: 10px">
      DỰ ÁN ĐỒ BẾP 🍳
    </h1>
    <p style="color: #7f8c8d; font-size: 1.1rem">
      Kiểm tra đường truyền: Vue 3 (Port 5173) 🤝 Spring Boot (Port 8080)
    </p>

    <div
      :style="{
        padding: '30px',
        border: '2px dashed ' + (connected ? '#2ecc71' : '#e74c3c'),
        backgroundColor: connected ? '#fafdfb' : '#fffdfd',
        display: 'inline-block',
        borderRadius: '12px',
        marginTop: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      }"
    >
      <h3 style="margin-top: 0; color: #34495e">Trạng thái hệ thống:</h3>
      <p
        :style="{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: connected ? '#27ae60' : '#c0392b',
        }"
      >
        {{ tinNhanBackend }}
      </p>
    </div>
  </div>
</template>

<style scoped>
/* Không cần viết gì ở đây cả */
</style>
