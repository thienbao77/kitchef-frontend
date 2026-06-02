import { createRouter, createWebHistory } from 'vue-router'

// 1. Import các trang giao diện của hệ thống
import trangChu from '@/views/trangChu.vue'
import cuaHang from '@/views/cuaHang.vue'
import noiChao from '@/views/noiChao.vue'
import dungCu from '@/views/dungCu.vue'
import khuyenMai from '@/views/khuyenMai.vue'
import gioiThieu from '@/views/gioiThieu.vue'
import DangKy from '../views/dangky.vue'
import DangNhap from '../views/dangNhap.vue'
import Cart from '../Gio-Hang/cart.vue'

const routes = [
  // --- GIAO DIỆN KHÁCH HÀNG (CLIENT) ---
  {
    path: '/',
    name: 'trangchu',
    component: trangChu
  },
  {
    path: '/cua-hang',
    name: 'cuahang',
    component: cuaHang
  },
  {
    path: '/noi-chao',
    name: 'noichao',
    component: noiChao
  },
  {
    path: '/dung-cu',
    name: 'dungcu',
    component: dungCu
  },
  {
    path: '/khuyen-mai',
    name: 'khuyenmai',
    component: khuyenMai
  },
  {
    path: '/gioi-thieu',
    name: 'gioithieu',
    component: gioiThieu
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
    path: '/cart',
    name: 'cart',
    component: Cart
  },
  
  // --- GIAO DIỆN QUẢN TRỊ (ADMIN) ---
  {
    path: '/admin',
    name: 'adminDashboard',
    component: () => import('@/views/Dashboard.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Tự động cuộn mượt lên đầu trang khi bấm chuyển đổi qua lại giữa các menu
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

export default router