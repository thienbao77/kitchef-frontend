<script setup>
// 1. Import cái file banner.vue mà bạn vừa viết vào đây
import Banner from '../components/banner.vue'
</script>

<template>
  <div class="trang-chu-container">
    <!-- 2. Gọi Banner hiển thị ở đầu Trang Chủ -->
    <Banner />

    <!-- Bạn có thể viết thêm các nội dung khác của trang chủ ở dưới này -->
    <div class="home-content">
      <h2>SẢN PHẨM NỔI BẬT</h2>
      <p>Danh sách các dụng cụ làm bếp cao cấp sẽ hiển thị ở đây...</p>
    </div>
  </div>
</template>

<style scoped>
.trang-chu-container {
  background-color: #000;
  color: #fff;
}
.home-content {
  text-align: center;
  padding: 50px 20px;
}
.home-content h2 {
  font-size: 2rem;
  color: #4CAF50;
  margin-bottom: 10px;
}
.home-content p {
  color: #888888;
}
</style>