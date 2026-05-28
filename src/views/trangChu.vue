<script setup>
import Banner from '../components/banner.vue'
import danhMuc from '@/components/danhMuc.vue';
import spNoiBat from '@/components/spNoiBat.vue';
import spBanChay from '@/components/spBanChay.vue';
import KinhNghiemHay from '@/components/kinhNghiemHay.vue';
</script>

<template>
  <div class="trang-chu-container">
    <!-- 1. BANNER TRƯỢT TỰ ĐỘNG Ở ĐẦU TRANG -->
    <Banner />
    <danhMuc></danhMuc>
    <spNoiBat></spNoiBat>
    <spBanChay></spBanChay>
    <KinhNghiemHay></KinhNghiemHay>


    <!-- 2. PHẦN NỘI DUNG CHỜ ĐỂ THIẾT KẾ TIẾP THEO Ý BẠN -->
    <div class="home-content">
      <div class="cooking-icon">🍳</div>
      <h2>CHÀO MỪNG BẠN ĐẾN VỚI KIT<span class="highlight">CHEF</span></h2>
      <p>Giao diện trang chủ đã được đưa về trạng thái cơ bản ngay sau khi làm xong Banner.</p>
      <p class="sub-text">Màu nền chủ đạo đã được chuyển sang tông màu sáng (Trắng - Xanh lá) mát mắt.</p>
    </div>
  </div>
</template>

<style scoped>
/* GIAO DIỆN SÁNG TINH TẾ (LIGHT MODE) */
.trang-chu-container {
  background-color: #f9fbf9; /* Màu nền trắng xám pha ánh xanh lá nhạt */
  color: #2c3e50;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.home-content {
  text-align: center;
  padding: 100px 20px;
}

.cooking-icon {
  font-size: 3.5rem;
  margin-bottom: 20px;
  animation: bounce 2s infinite;
}

.home-content h2 {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1a251e;
  margin-bottom: 15px;
  letter-spacing: 1px;
}

.highlight {
  color: #4CAF50; /* Màu xanh lá thương hiệu */
}

.home-content p {
  color: #5c6a60;
  font-size: 1.1rem;
  margin: 6px 0;
}

.sub-text {
  color: #4CAF50 !important;
  font-weight: 600;
  font-size: 0.95rem !important;
  margin-top: 15px !important;
}

/* Hiệu ứng nhấp nháy chuyển động nhẹ cho chiếc chảo */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>