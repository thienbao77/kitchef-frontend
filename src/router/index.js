import { createRouter, createWebHistory } from 'vue-router'

// 1. Import các trang của bạn vào đây
import trangChu from '@/views/trangChu.vue'
import DangKy from '../views/dangky.vue'
import DangNhap from '../views/dangNhap.vue'
import Cart from '../Gio-Hang/cart.vue' // <--- THÊM DÒNG NÀY (Đường dẫn tới file Cart.vue của bạn)
import cuaHang from '@/views/cuaHang.vue'

// Tạm thời tạo một component trang chủ nhanh để hiển thị (Nếu không dùng đến bạn có thể xóa khối này)
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
    component: trangChu
  },
  {
    path: '/cua-hang', // 2. Thêm đường dẫn cho trang cửa hàng
    name: 'cuahang',
    component: cuaHang
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
  },
  {
    path: '/cart',         // <--- THÊM ROUTE CHO GIỎ HÀNG
    name: 'cart',
    component: Cart
  },
  
  {path: '/admin',
    name: 'adminDashboard',
    component: () => import('@/views/Dashboard.vue') // Link trỏ tới file Dashboard bạn vừa tạo
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router