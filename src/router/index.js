import { createRouter, createWebHistory } from 'vue-router'
// Import các trang của bạn vào đây
import TrangChu from '../App.vue' // Chúng ta sẽ dọn dẹp App.vue thành layout chung, còn nội dung trang chủ sẽ chuyển ra ngoài sau. Hoặc tạm thời ta khai báo thế này:
import DangKy from '../views/dangky.vue'
import DangNhap from '../views/dangNhap.vue'

// Tạm thời tạo một component trang chủ nhanh để hiển thị
const HomeView = {
  template: `
    <div style="text-align: center; padding: 100px 20px;">
      <h1 style="font-size: 3rem; font-weight: 800; margin-bottom: 10px;">CHÀO MỪNG BẠN ĐẾN VỚI KIT<span style="color: #4CAF50">CHEF</span> 🍳</h1>
      <p style="color: #888888; font-size: 1.2rem;">Hệ thống phân phối dụng cụ nhà bếp cao cấp và chất lượng bậc nhất.</p>
    </div>
  `
}

const routes = [
  {
    path: '/',
    name: 'trangchu',
    component: HomeView
  },
  {
    path: '/dang-ky',
    name: 'dangky',
    component: DangKy
  },
  {
    path: '/dang-nhap',
    name: 'dangnhap',
    component: DangNhap
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
