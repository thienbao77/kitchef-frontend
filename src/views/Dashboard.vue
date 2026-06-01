<script setup>
import { ref } from "vue";
// Import component con vừa tạo
import DanhMucSP from "@/components/admin/DanhMucSP.vue";
import NguoiDung from "@/components/admin/NguoiDung.vue";
import GiamGia from "@/components/admin/GiamGia.vue";
import PhanHoi from "@/components/admin/PhanHoi.vue";

// BIẾN KIỂM SOÁT MÀN HÌNH CHÍNH (SIDEBAR)
const currentTab = ref("products");

// MẢNG MENU SIDEBAR CHÍNH
const menuItems = ref([
  {
    id: "products",
    name: "Danh mục & Sản phẩm",
    icon: "fa-solid fa-boxes-stacked",
  },
  {
    id: "users",
    name: "Nhân viên & Khách hàng",
    icon: "fa-solid fa-users-gear",
  },
  { id: "inventory", name: "Quản lý nhập kho", icon: "fa-solid fa-warehouse" },
  { id: "vouchers", name: "Mã giảm giá (Voucher)", icon: "fa-solid fa-ticket" },
  { id: "feedback", name: "Liên hệ & Bình luận", icon: "fa-solid fa-comments" },
  { id: "reports", name: "Báo cáo & Thống kê", icon: "fa-solid fa-chart-line" },
]);

const handleLogout = () => {
  alert("Đang xử lý đăng xuất hệ thống quản trị...");
};
</script>

<template>
  <div class="admin-dashboard-wrapper">
    <aside class="admin-sidebar">
      <div class="sidebar-brand">
        <i class="fa-solid fa-toolbox brand-icon"></i>
        <span>KIT<span class="text-highlight">CHEF</span> ADMIN</span>
      </div>

      <nav class="sidebar-menu">
        <ul>
          <li
            v-for="item in menuItems"
            :key="item.id"
            :class="{ active: currentTab === item.id }"
            @click="currentTab = item.id"
          >
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <button class="btn-sidebar-logout" @click="handleLogout">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>

    <div class="admin-main-container">
      <header class="admin-top-header">
        <div class="header-left">
          <h2 class="page-title">
            <span v-if="currentTab === 'products'"
              >Quản Lý Danh Mục & Sản Phẩm</span
            >
            <span v-else-if="currentTab === 'users'"
              >Quản Lý Tài Khoản Nhân Viên & Khách Hàng</span
            >
            <span v-else-if="currentTab === 'inventory'"
              >Quản Lý Nhập Kho (Inventory CRUD)</span
            >
            <span v-else-if="currentTab === 'vouchers'"
              >Quản Lý Mã Giảm Giá (Voucher CRUD)</span
            >
            <span v-else-if="currentTab === 'feedback'"
              >Phản Hồi Liên Hệ & Quản Lý Bình Luận</span
            >
            <span v-else-if="currentTab === 'reports'"
              >Báo Cáo Doanh Thu & Hàng Bán Chạy</span
            >
          </h2>
        </div>
        <div class="header-right">
          <div class="admin-profile">
            <div class="avatar-circle">A</div>
            <div class="profile-info">
              <span class="admin-name">Tô Đức Anh</span>
              <span class="admin-role">Super Admin</span>
            </div>
          </div>
        </div>
      </header>

      <main class="admin-content-body">
        <DanhMucSP v-if="currentTab === 'products'" />
        <NguoiDung v-else-if="currentTab === 'users'" />
        <GiamGia v-else-if="currentTab === 'vouchers'" />
        <PhanHoi v-else-if="currentTab === 'feedback'" />

        <div v-else class="admin-card animate-fade">
          <div v-if="currentTab === 'inventory'" class="tab-content-empty">
            <div class="placeholder-icon">
              <i class="fa-solid fa-warehouse"></i>
            </div>
            <h3>Khung lập phiếu nhập kho sẵn sàng</h3>
            <p>
              Nơi xây dựng form tạo phiếu nhập kho (`InventoryImports`) tăng
              `stock_quantity` của bảng `Products`.
            </p>
          </div>
          <div v-else-if="currentTab === 'reports'" class="tab-content-empty">
            <div class="placeholder-icon">
              <i class="fa-solid fa-chart-line"></i>
            </div>
            <h3>Khung thống kê doanh số sẵn sàng</h3>
            <p>
              Nơi tổng hợp dữ liệu hóa đơn `Orders` để vẽ biểu đồ tăng trưởng
              doanh thu.
            </p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* CSS LAYOUT KHUNG ĐƯỢC GIỮ NGUYÊN ĐỂ ĐẢM BẢO VIỀN KHUNG CHUẨN XÁC */
.admin-dashboard-wrapper {
  display: flex;
  min-height: 100vh;
  background-color: #f4f7f5;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
.admin-sidebar {
  width: 280px;
  background-color: #1a1a1a;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.05);
}
.sidebar-brand {
  padding: 25px 20px;
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: 1px;
  border-bottom: 1px solid #2a2a2a;
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand-icon,
.text-highlight {
  color: #4caf50;
}
.sidebar-menu {
  flex-grow: 1;
  padding: 20px 0;
}
.sidebar-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.sidebar-menu li {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 25px;
  color: #b3b3b3;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s ease;
  border-left: 4px solid transparent;
}
.sidebar-menu li:hover,
.sidebar-menu li.active {
  background-color: #222222;
  color: #4caf50;
}
.sidebar-menu li.active {
  border-left-color: #4caf50;
  font-weight: 700;
}
.sidebar-menu li i {
  font-size: 1.1rem;
  width: 20px;
}
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #2a2a2a;
}
.btn-sidebar-logout {
  width: 100%;
  padding: 12px;
  background-color: transparent;
  border: 1px solid #333333;
  color: #ff3b30;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.btn-sidebar-logout:hover {
  background-color: #ff3b30;
  color: #ffffff;
  border-color: #ff3b30;
}
.admin-main-container {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.admin-top-header {
  background-color: #ffffff;
  height: 75px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eef3ef;
}
.page-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #1a251e;
  margin: 0;
}
.admin-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar-circle {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: #e8f5ec;
  color: #4caf50;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
  border: 1px solid #cedbd0;
}
.profile-info {
  display: flex;
  flex-direction: column;
}
.admin-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #2c3e50;
}
.admin-role {
  font-size: 0.75rem;
  color: #888888;
  font-weight: 600;
}
.admin-content-body {
  padding: 30px 40px;
  flex-grow: 1;
}
.admin-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #eef3ef;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
}
.tab-content-empty {
  max-width: 600px;
  margin: 40px auto;
  text-align: center;
}
.placeholder-icon {
  font-size: 4rem;
  color: #cedbd0;
  margin-bottom: 20px;
}
.tab-content-empty h3 {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1a251e;
  margin-bottom: 12px;
}
.tab-content-empty p {
  color: #66756c;
  line-height: 1.6;
  margin: 0;
}
.animate-fade {
  animation: fadeIn 0.4s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
