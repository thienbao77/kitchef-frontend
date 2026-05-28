<script setup>
import { ref } from "vue";

// 1. Biến kiểm soát việc đóng/mở Menu trên điện thoại (Hamburger Menu)
const isMobileMenuOpen = ref(false);

// 2. Biến kiểm soát việc mở các Dropdown lớn ("Nồi chảo", "Dao kéo")
// Nếu giá trị là 'noi-chao' thì hiện menu Nồi chảo, nếu là 'dao-keo' thì hiện Dao kéo, null là đóng hết.
const activeDropdown = ref(null);

// 3. Biến kiểm soát việc mở các Submenu con (như "Chảo", "Dao")
const activeSubmenu = ref(null);

// Hàm xử lý khi bấm mở/đóng Dropdown lớn
const toggleDropdown = (menuName) => {
  if (activeDropdown.value === menuName) {
    activeDropdown.value = null; // Nếu đang mở mà bấm lại thì đóng
  } else {
    activeDropdown.value = menuName; // Mở menu được bấm
    activeSubmenu.value = null; // Đóng hết các menu con cấp 2 đang mở trước đó
  }
};

// Hàm xử lý khi bấm mở/đóng Submenu cấp 2 (Chảo, Dao...)
const toggleSubmenu = (submenuName, event) => {
  // Ngăn chặn sự kiện lan tỏa lên thẻ cha (để tránh làm đóng menu lớn)
  event.stopPropagation();

  if (activeSubmenu.value === submenuName) {
    activeSubmenu.value = null;
  } else {
    activeSubmenu.value = submenuName;
  }
};
</script>

<template>
  <nav class="menu-wrapper">
    <div class="menu-container">
      <!-- NÚT HAMBURGER (Chỉ hiện trên điện thoại khi thu nhỏ màn hình) -->
      <button
        class="menu-toggler"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <span class="toggler-icon"></span>
        <span class="toggler-icon"></span>
        <span class="toggler-icon"></span>
      </button>

      <!-- DANH SÁCH MENU CHÍNH -->
      <!-- Nếu isMobileMenuOpen = true thì thêm class 'show' để hiện menu trên điện thoại -->
      <div class="menu-collapse" :class="{ show: isMobileMenuOpen }">
        <ul class="nav-list">
          <!-- Mục 1: Trang chủ -->
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">Trang chủ</RouterLink>
          </li>
          <!-- <li class="nav-item">
  <RouterLink to="/cua-hang" class="nav-link" active-class="active">
    Cửa hàng
  </RouterLink>
</li> -->

          <!-- Mục 2: NỒI CHẢO (Có Dropdown & Submenu cấp 2) -->
          <!-- Nếu activeDropdown === 'noi-chao' thì thêm class 'open' -->
          <li
            class="nav-item has-dropdown"
            :class="{ open: activeDropdown === 'noi-chao' }"
          >
            <a
              class="nav-link dropdown-toggle"
              href="#"
              @click.prevent="toggleDropdown('noi-chao')"
            >
              Nồi Chảo <i class="fa fa-angle-down"></i>
            </a>

            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">Nồi lẻ</a></li>

              <!-- Submenu Chảo -->
              <li
                class="dropdown-submenu"
                :class="{ 'open-sub': activeSubmenu === 'chao' }"
              >
                <a
                  class="dropdown-item sub-toggle"
                  href="#"
                  @click.prevent="toggleSubmenu('chao', $event)"
                >
                  Chảo <i class="fa fa-angle-right"></i>
                </a>
                <ul class="submenu">
                  <li><a class="dropdown-item" href="#">Chảo inox</a></li>
                  <li><a class="dropdown-item" href="#">Chảo chống dính</a></li>
                </ul>
              </li>

              <li><a class="dropdown-item" href="#">Nồi áp suất</a></li>
            </ul>
          </li>

          <!-- Mục 3: DAO KÉO (Có Dropdown & Submenu cấp 2) -->
          <li
            class="nav-item has-dropdown"
            :class="{ open: activeDropdown === 'dao-keo' }"
          >
            <a
              class="nav-link dropdown-toggle"
              href="#"
              @click.prevent="toggleDropdown('dao-keo')"
            >
              Dao kéo <i class="fa fa-angle-down"></i>
            </a>

            <ul class="dropdown-menu">
              <!-- Submenu Dao -->
              <li
                class="dropdown-submenu"
                :class="{ 'open-sub': activeSubmenu === 'dao' }"
              >
                <a
                  class="dropdown-item sub-toggle"
                  href="#"
                  @click.prevent="toggleSubmenu('dao', $event)"
                >
                  Dao <i class="fa fa-angle-right"></i>
                </a>
                <ul class="submenu">
                  <li><a class="dropdown-item" href="#">Dao thái</a></li>
                  <li><a class="dropdown-item" href="#">Dao gọt hoa quả</a></li>
                </ul>
              </li>

              <!-- Submenu Kéo -->
              <li
                class="dropdown-submenu"
                :class="{ 'open-sub': activeSubmenu === 'keo' }"
              >
                <a
                  class="dropdown-item sub-toggle"
                  href="#"
                  @click.prevent="toggleSubmenu('keo', $event)"
                >
                  Kéo <i class="fa fa-angle-right"></i>
                </a>
                <ul class="submenu">
                  <li>
                    <a class="dropdown-item" href="#">Kéo cắt thực phẩm</a>
                  </li>
                  <li><a class="dropdown-item" href="#">Kéo cắt xương</a></li>
                </ul>
              </li>

              <li><a class="dropdown-item" href="#">Phụ kiện dao</a></li>
            </ul>
          </li>

          <!-- Các mục thông thường -->
          <li class="nav-item">
            <a class="nav-link" href="#">Dụng cụ ăn</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Khuyến mãi</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Giới thiệu</a>
          </li>
        </ul>
      </div>

      <!-- NHÓM NÚT ĐĂNG NHẬP / ĐĂNG KÝ -->
      <div class="auth-buttons">
        <!-- Chuyển hướng sang trang đăng nhập bằng liên kết chuẩn -->
        <RouterLink to="/dang-nhap" class="btn-auth btn-login">Đăng nhập</RouterLink>
        <RouterLink to="/dang-ky" class="btn-auth btn-register">Đăng ký</RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* NỀN MENU */
.menu-wrapper {
  background-color: #1a1a1a; /* Màu đen tối giản sang trọng */
  border-bottom: 2px solid #4caf50; /* Gạch chân xanh lá làm điểm nhấn */
  font-family: Arial, sans-serif;
}

.menu-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

/* DANH SÁCH MENU CHÍNH */
.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex; /* Dàn hàng ngang */
  align-items: center;
}

.nav-item {
  position: relative; /* Làm gốc định vị cho các dropdown con hiển thị chính xác */
}

.nav-link {
  display: block;
  padding: 20px 18px;
  color: #cccccc;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #4caf50; /* Đổi màu xanh lá khi di chuột qua */
}

/* ICON MŨI TÊN */
.fa {
  font-size: 0.8rem;
  margin-left: 4px;
}

/* DROPDOWN MENU CẤP 1 (ẨN MẶC ĐỊNH) */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #222222;
  border: 1px solid #333333;
  list-style: none;
  padding: 10px 0;
  margin: 0;
  min-width: 180px;
  border-radius: 4px;
  display: none; /* Ẩn đi */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  z-index: 999;
}

/* KHI THÊM CLASS .open THÌ HIỆN DROPDOWN */
.nav-item.open .dropdown-menu {
  display: block;
}

.dropdown-item {
  display: block;
  padding: 10px 20px;
  color: #dddddd;
  text-decoration: none;
  font-size: 0.9rem;
  transition:
    background 0.2s,
    color 0.2s;
}

.dropdown-item:hover {
  background-color: #4caf50;
  color: white;
}

/* DROPDOWN SUBMENU CẤP 2 (MENU CON) */
.dropdown-submenu {
  position: relative;
}

.submenu {
  position: absolute;
  top: 0;
  left: 100%; /* Đẩy sang bên phải của menu cha */
  background-color: #2a2a2a;
  border: 1px solid #444444;
  list-style: none;
  padding: 5px 0;
  margin: 0;
  min-width: 180px;
  border-radius: 4px;
  display: none; /* Ẩn đi */
  z-index: 1000;
}

/* KHI CLICK VÀO SUBMENU THÌ HIỆN MENU CON */
.dropdown-submenu.open-sub .submenu {
  display: block;
}

/* NHÓM NÚT ĐĂNG NHẬP / ĐĂNG KÝ */
.auth-buttons {
  display: flex;
  gap: 12px;
}

.btn-auth {
  padding: 8px 18px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-login {
  color: #cccccc;
  border: 1px solid #444444;
}

.btn-login:hover {
  border-color: #4caf50;
  color: #4caf50;
}

.btn-register {
  background-color: #4caf50;
  color: white;
  border: 1px solid #4caf50;
}

.btn-register:hover {
  background-color: #45a049;
  box-shadow: 0 4px 10px rgba(76, 175, 80, 0.3);
}

/* PHẦN ĐIỆN THOẠI (RESPONSIVE) */
.menu-toggler {
  display: none; /* Ẩn nút Hamburger trên máy tính */
  background: none;
  border: none;
  cursor: pointer;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
}

.toggler-icon {
  display: block;
  width: 25px;
  height: 3px;
  background-color: white;
  border-radius: 2px;
}

@media (max-width: 768px) {
  .menu-container {
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 20px;
  }

  .menu-toggler {
    display: flex; /* Hiện nút Hamburger trên điện thoại */
    position: absolute;
    right: 20px;
    top: 15px;
  }

  .menu-collapse {
    width: 100%;
    display: none; /* Ẩn toàn bộ menu trên điện thoại */
  }

  .menu-collapse.show {
    display: block; /* Hiện menu khi bấm nút Hamburger */
  }

  .nav-list {
    flex-direction: column; /* Xếp dọc các dòng trên điện thoại */
    width: 100%;
    align-items: flex-start;
    padding-top: 10px;
  }

  .nav-item {
    width: 100%;
  }

  .nav-link {
    padding: 12px 0;
  }

  .dropdown-menu,
  .submenu {
    position: static; /* Đưa menu con chảy dọc xuống dưới thay vì bay lơ lửng */
    width: 100%;
    background-color: #222222;
    border: none;
    padding-left: 15px;
    box-shadow: none;
  }

  .auth-buttons {
    width: 100%;
    justify-content: center;
    margin-top: 15px;
    padding-bottom: 10px;
  }
}
</style>
