<script setup>
// Cần import RouterLink để component nhận diện nếu dự án không dùng auto-import
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="top-header">
    <div class="header-container">
      <div class="header-logo">
        <a href="/">
          <img src="" alt="KitChef" class="logo-img" />
          <span class="logo-text"
            >KIT<span class="text-highlight">CHEF</span></span
          >
        </a>
      </div>

      <div class="header-search">
        <form @submit.prevent class="search-form">
          <input
            type="search"
            placeholder="Tìm kiếm dụng cụ làm bếp, công thức..."
            aria-label="Search"
            class="search-input"
          />
          <button class="search-btn" type="submit">
            <i class="fa fa-search" aria-hidden="true"></i>
          </button>
        </form>
      </div>

      <div class="header-contact">
        <div class="contact-icon">
          <i class="fa fa-phone" aria-hidden="true"></i>
        </div>
        <div class="contact-info">
          <span class="contact-label">Hotline hỗ trợ 24/7</span>
          <a href="tel:0348363413" class="contact-number">0348.363.413</a>
        </div>
      </div>

      <div class="header-cart">
        <router-link to="/cart" class="cart-btn">
          <div class="cart-icon-wrapper">
            <i class="fa fa-shopping-cart" aria-hidden="true"></i>
            <span class="cart-badge">2</span>
          </div>
          <span class="cart-text">Giỏ hàng</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* TOÀN BỘ THANH HEADER */
.top-header {
  background-color: #111111; /* Màu nền đen xám sang trọng giống các web nhà hàng cao cấp */
  border-bottom: 1px solid #222222;
  padding: 15px 0;
  color: #ffffff;
  font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* KHUNG CHỨA (ÉP LÊN MỘT HÀNG NGANG BẰNG FLEXBOX) */
.header-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center; /* Căn giữa tất cả các mục theo chiều dọc */
  justify-content: space-between; /* Tự động chia đều khoảng cách giữa 4 khối */
  gap: 20px; /* Tạo khoảng cách an toàn giữa các khối tránh dính nhau */
}

/* 1. CSS CHO LOGO */
.header-logo a {
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
}
.logo-img {
  max-height: 40px;
  display: none; /* Ẩn đi khi chưa có link ảnh thật, có ảnh thật thì xóa dòng này */
}
.logo-text {
  font-size: 1.6rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 1px;
}
.text-highlight {
  color: #4caf50; /* Màu xanh lá tạo điểm nhấn thương hiệu */
}

/* 2. CSS THANH TÌM KIẾM (BO TRÒN, HIỆN ĐẠI) */
.header-search {
  flex: 1; /* Cho phép thanh tìm kiếm co giãn chiếm không gian trống ở giữa */
  max-width: 500px; /* Giới hạn độ rộng vừa mắt */
}
.search-form {
  display: flex;
  position: relative;
  width: 100%;
}
.search-input {
  width: 100%;
  padding: 12px 50px 12px 20px;
  background-color: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 30px; /* Bo tròn bầu bĩnh cực đẹp */
  color: #ffffff;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}
.search-input:focus {
  outline: none;
  border-color: #4caf50;
  background-color: #222222;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.2);
}
.search-btn {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888888;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: color 0.2s;
}
.search-btn:hover {
  color: #4caf50;
}

/* 3. CSS KHU VỰC HOTLINE */
.header-contact {
  display: flex;
  align-items: center;
  gap: 12px;
}
.contact-icon {
  width: 40px;
  height: 40px;
  background-color: #1a1a1a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4caf50;
  border: 1px solid #333333;
}
.contact-info {
  display: flex;
  flex-direction: column; /* Xếp chữ Hotline lên trên, số điện thoại xuống dưới */
}
.contact-label {
  font-size: 0.75rem;
  color: #888888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.contact-number {
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  text-decoration: none;
  transition: color 0.2s;
}
.contact-number:hover {
  color: #4caf50;
}

/* 4. CSS NÚT GIỎ HÀNG XỊN SÒ (Đã tối ưu hóa cho thẻ định tuyến a/router-link) */
.cart-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: #4caf50; /* Đồng bộ tông màu xanh lá */
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  text-decoration: none; /* 👇 THÊM DÒNG NÀY: Để chữ không bị gạch chân khi đổi sang router-link */
}
.cart-btn:hover {
  background-color: #45a049;
  transform: translateY(-2px); /* Hiệu ứng nảy nhẹ khi di chuột vào */
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  color: #ffffff; /* Đảm bảo màu chữ luôn trắng khi di chuột */
}
.cart-icon-wrapper {
  position: relative;
  font-size: 1.2rem;
}
/* Chấm tròn đỏ nhỏ hiển thị số lượng đồ trong giỏ hàng */
.cart-badge {
  position: absolute;
  top: -8px;
  right: -10px;
  background-color: #ff3b30; /* Màu đỏ cảnh báo số lượng */
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  line-height: 1;
  border: 2px solid #4caf50; /* Tạo viền bao quanh tiệp màu nút */
}

/* RESPONSIVE: TỰ ĐỘNG THU GỌN KHI MÀN HÌNH ĐIỆN THOẠI QUÁ NHỎ */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column; /* Chuyển thành hàng dọc trên điện thoại cho khỏi vỡ khung */
    gap: 15px;
    text-align: center;
  }
  .header-search {
    max-width: 100%;
  }
  .header-contact {
    display: none; /* Ẩn bớt hotline trên mobile cho đỡ chật màn hình */
  }
}
</style>