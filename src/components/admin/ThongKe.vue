<script setup>
import { ref, computed } from 'vue'

// ========================================================
// 1. DỮ LIỆU TỔNG QUAN
// ========================================================
const summaryData = ref({
  totalRevenue: 125400000,
  newOrders: 142,
  newCustomers: 28,
  lowStockCount: 3
})

// ========================================================
// 2. DỮ LIỆU CHI TIẾT CHO CÁC BIỂU ĐỒ (Có data ẩn để Drill-down)
// ========================================================

// A. Biểu đồ Doanh thu (Kèm chi tiết các món đã bán trong ngày)
const revenueData = ref([
  { date: '15/05', amount: 12000000, details: [{ name: 'Chảo Vân Đá', qty: 5, total: 4450000 }, { name: 'Dao Damascus', qty: 2, total: 6400000 }] },
  { date: '16/05', amount: 8500000, details: [{ name: 'Bộ Bát Đĩa Sứ', qty: 7, total: 7700000 }] },
  { date: '17/05', amount: 15400000, details: [{ name: 'Nồi Gang Đỏ', qty: 4, total: 9800000 }, { name: 'Thớt Gỗ Teak', qty: 5, total: 3250000 }] },
  { date: '18/05', amount: 9200000, details: [{ name: 'Khay Đựng Dao', qty: 10, total: 4900000 }] },
  { date: '19/05', amount: 21000000, details: [{ name: 'Nồi Gang Đỏ', qty: 6, total: 14700000 }] },
  { date: '20/05', amount: 18500000, details: [{ name: 'Chảo Lodge', qty: 8, total: 10000000 }, { name: 'Bộ Dao 3 món', qty: 2, total: 6400000 }] },
  { date: '21/05', amount: 26000000, details: [{ name: 'Nồi Gang Đỏ', qty: 5, total: 12250000 }, { name: 'Bộ Bát Đĩa Sứ', qty: 4, total: 4400000 }, { name: 'Chảo Vân Đá', qty: 10, total: 8900000 }] }
])

// B. Biểu đồ Khách hàng mới (Kèm danh sách user đăng ký ngày đó)
const customerData = ref([
  { date: '15/05', count: 2, users: [{ name: 'Trần B', email: 'tranb@gmail.com' }, { name: 'Lê C', email: 'lec@gmail.com' }] },
  { date: '16/05', count: 5, users: [{ name: 'Phạm D', email: 'phamd@gmail.com' }, { name: 'Võ E', email: 'voe@gmail.com' }] },
  { date: '17/05', count: 3, users: [{ name: 'Hoàng F', email: 'hoangf@gmail.com' }] },
  { date: '18/05', count: 8, users: [{ name: 'Ngô G', email: 'ngog@gmail.com' }, { name: 'Bùi H', email: 'buih@gmail.com' }] },
  { date: '19/05', count: 4, users: [{ name: 'Đặng Y', email: 'dangy@gmail.com' }] },
  { date: '20/05', count: 12, users: [{ name: 'Lý K', email: 'lyk@gmail.com' }, { name: 'Vũ M', email: 'vum@gmail.com' }, { name: 'Hồ N', email: 'hon@gmail.com' }] },
  { date: '21/05', count: 7, users: [{ name: 'Trương P', email: 'truongp@gmail.com' }, { name: 'Đinh Q', email: 'dinhq@gmail.com' }] }
])

// C. Biểu đồ Top Sản Phẩm Bán Chạy (Kèm chi tiết người mua)
const topProducts = ref([
  { id: 1, name: 'Chảo Chống Dính Vân Đá Tefal 28cm', sold: 345, revenue: 307050000, buyers: [{ name: 'Nguyễn A', date: '21/05', qty: 2 }, { name: 'Lê B', date: '20/05', qty: 1 }] },
  { id: 2, name: 'Nồi Gang Tráng Men KitChef Đỏ', sold: 212, revenue: 519400000, buyers: [{ name: 'Trần C', date: '21/05', qty: 1 }] },
  { id: 3, name: 'Bộ Dao Damascus 3 Món', sold: 156, revenue: 499200000, buyers: [{ name: 'Võ D', date: '19/05', qty: 1 }] },
])

const lowStockProducts = ref([
  { id: 10, name: 'Máy Xay Sinh Tố Mini Philips', category: 'Thiết bị điện', stock: 2, status: 'Nguy cấp' },
  { id: 11, name: 'Bộ Nồi Inox 5 Đáy Sunhouse', category: 'Nồi, Chảo', stock: 5, status: 'Cần nhập' }
])

// ========================================================
// 3. TÍNH TOÁN TỶ LỆ BIỂU ĐỒ (HEIGHT / WIDTH)
// ========================================================
const maxRevenue = computed(() => Math.max(...revenueData.value.map(d => d.amount)))
const getRevHeight = (val) => (val / maxRevenue.value) * 100 + '%'

const maxCustomers = computed(() => Math.max(...customerData.value.map(d => d.count)))
const getCustHeight = (val) => (val / maxCustomers.value) * 100 + '%'

const maxSold = computed(() => Math.max(...topProducts.value.map(d => d.sold)))
const getProdWidth = (val) => (val / maxSold.value) * 100 + '%'

// ========================================================
// 4. LOGIC HIỂN THỊ MODAL CHI TIẾT (DRILL-DOWN)
// ========================================================
const detailModal = ref({
  isOpen: false,
  title: '',
  type: '', // 'revenue', 'customers', 'product'
  data: null
})

// Bấm vào biểu đồ doanh thu
const openRevenueDetail = (dayData) => {
  detailModal.value = {
    isOpen: true,
    title: `Chi tiết Doanh thu ngày ${dayData.date}`,
    type: 'revenue',
    data: dayData
  }
}

// Bấm vào biểu đồ khách hàng
const openCustomerDetail = (dayData) => {
  detailModal.value = {
    isOpen: true,
    title: `Danh sách Khách hàng mới ngày ${dayData.date}`,
    type: 'customers',
    data: dayData
  }
}

// Bấm vào Top sản phẩm
const openProductDetail = (prodData) => {
  detailModal.value = {
    isOpen: true,
    title: `Lịch sử bán: ${prodData.name}`,
    type: 'product',
    data: prodData
  }
}

const formatPrice = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
const formatShortPrice = (value) => {
  if (value >= 1000000) return (value / 1000000).toFixed(1) + 'Tr'
  return value
}
</script>

<template>
  <div class="dashboard-stats-wrapper">
    
    <div class="summary-cards-grid animate-fade">
      <div class="stat-card">
        <div class="stat-icon-box bg-revenue"><i class="fa-solid fa-money-bill-trend-up"></i></div>
        <div class="stat-info">
          <p class="stat-title">Doanh thu tháng này</p>
          <h3 class="stat-value text-revenue">{{ formatPrice(summaryData.totalRevenue) }}</h3>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-box bg-orders"><i class="fa-solid fa-cart-shopping"></i></div>
        <div class="stat-info">
          <p class="stat-title">Đơn hàng mới</p>
          <h3 class="stat-value">{{ summaryData.newOrders }}</h3>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-box bg-customers"><i class="fa-solid fa-users"></i></div>
        <div class="stat-info">
          <p class="stat-title">Khách mới</p>
          <h3 class="stat-value">{{ summaryData.newCustomers }}</h3>
        </div>
      </div>
      <div class="stat-card border-warning">
        <div class="stat-icon-box bg-warning"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <div class="stat-info">
          <p class="stat-title">Sắp hết hàng</p>
          <h3 class="stat-value text-warning">{{ summaryData.lowStockCount }} SP</h3>
        </div>
      </div>
    </div>

    <div class="charts-row animate-fade delay-1">
      
      <div class="admin-card chart-card">
        <div class="card-header">
          <h3><i class="fa-solid fa-chart-line"></i> Biểu đồ Doanh thu (Click để xem chi tiết)</h3>
        </div>
        <div class="css-bar-chart">
          <div class="chart-y-axis">
            <span>{{ formatShortPrice(maxRevenue) }}</span>
            <span>{{ formatShortPrice(maxRevenue / 2) }}</span>
            <span>0</span>
          </div>
          <div class="chart-bars-container">
            <div class="bar-wrapper" v-for="(item, index) in revenueData" :key="index" @click="openRevenueDetail(item)">
              <div class="bar-fill bg-green" :style="{ height: getRevHeight(item.amount) }">
                <div class="bar-tooltip">{{ formatPrice(item.amount) }}</div>
              </div>
              <span class="bar-label">{{ item.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="admin-card chart-card">
        <div class="card-header">
          <h3><i class="fa-solid fa-user-plus"></i> Khách hàng đăng ký mới</h3>
        </div>
        <div class="css-bar-chart">
          <div class="chart-y-axis">
            <span>{{ maxCustomers }}</span>
            <span>{{ Math.round(maxCustomers / 2) }}</span>
            <span>0</span>
          </div>
          <div class="chart-bars-container">
            <div class="bar-wrapper" v-for="(item, index) in customerData" :key="index" @click="openCustomerDetail(item)">
              <div class="bar-fill bg-purple" :style="{ height: getCustHeight(item.count) }">
                <div class="bar-tooltip">{{ item.count }} user</div>
              </div>
              <span class="bar-label">{{ item.date }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="charts-row animate-fade delay-2">
      
      <div class="admin-card">
        <div class="card-header">
          <h3><i class="fa-solid fa-ranking-star"></i> Top 3 Sản phẩm Bán chạy</h3>
        </div>
        <div class="horizontal-chart">
          <div class="h-bar-row" v-for="prod in topProducts" :key="prod.id" @click="openProductDetail(prod)">
            <div class="h-bar-label">
              <span class="prod-name">{{ prod.name }}</span>
              <span class="prod-val">{{ prod.sold }} cái</span>
            </div>
            <div class="h-bar-track">
              <div class="h-bar-fill bg-blue" :style="{ width: getProdWidth(prod.sold) }"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="admin-card alert-card">
        <div class="card-header">
          <h3><i class="fa-solid fa-boxes-stacked"></i> Cảnh báo sắp hết hàng</h3>
        </div>
        <table class="admin-table warning-table">
          <thead>
            <tr>
              <th>Tên Sản phẩm</th>
              <th>Tồn kho</th>
              <th>Mức độ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in lowStockProducts" :key="item.id">
              <td class="bold-text">{{ item.name }}</td>
              <td><span class="stock-alert-num">{{ item.stock }}</span></td>
              <td>
                <span :class="['stock-badge', item.stock <= 3 ? 'badge-danger' : 'badge-warning']">{{ item.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <div :class="['admin-modal-overlay', { show: detailModal.isOpen }]">
      <div class="admin-modal-box">
        <div class="modal-header">
          <h3>{{ detailModal.title }}</h3>
          <button class="btn-close-modal" @click="detailModal.isOpen = false">&times;</button>
        </div>
        
        <div class="modal-form-body">
          
          <table class="admin-table" v-if="detailModal.type === 'revenue' && detailModal.data">
            <thead>
              <tr>
                <th>Tên sản phẩm bán ra</th>
                <th style="text-align: center;">Số lượng</th>
                <th style="text-align: right;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in detailModal.data.details" :key="idx">
                <td style="font-weight: 600;">{{ item.name }}</td>
                <td style="text-align: center;">{{ item.qty }}</td>
                <td style="text-align: right; color: #ff3b30; font-weight: 700;">{{ formatPrice(item.total) }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="text-align: right; font-weight: 800;">TỔNG DOANH THU NGÀY:</td>
                <td style="text-align: right; font-weight: 800; color: #4CAF50; font-size: 1.1rem;">
                  {{ formatPrice(detailModal.data.amount) }}
                </td>
              </tr>
            </tfoot>
          </table>

          <table class="admin-table" v-if="detailModal.type === 'customers' && detailModal.data">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên Khách Hàng</th>
                <th>Email Đăng Ký</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(user, idx) in detailModal.data.users" :key="idx">
                <td>{{ idx + 1 }}</td>
                <td style="font-weight: 600; color: #1a73e8;">{{ user.name }}</td>
                <td>{{ user.email }}</td>
              </tr>
            </tbody>
          </table>

          <table class="admin-table" v-if="detailModal.type === 'product' && detailModal.data">
            <thead>
              <tr>
                <th>Khách hàng mua</th>
                <th>Ngày mua</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(buyer, idx) in detailModal.data.buyers" :key="idx">
                <td style="font-weight: 600;">{{ buyer.name }}</td>
                <td>{{ buyer.date }}</td>
                <td style="font-weight: 700;">{{ buyer.qty }} chiếc</td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.dashboard-stats-wrapper { display: flex; flex-direction: column; gap: 25px; padding-bottom: 30px; font-family: 'Segoe UI', sans-serif;}

/* SUMMARY CARDS */
.summary-cards-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.stat-card { background-color: #ffffff; border-radius: 12px; border: 1px solid #eef3ef; padding: 25px; display: flex; align-items: center; gap: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.01); transition: transform 0.2s; }
.stat-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.04); }
.border-warning { border: 1px solid #ffe0cc; }
.stat-icon-box { width: 60px; height: 60px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
.bg-revenue { background-color: #e8f5ec; color: #4CAF50; }
.bg-orders { background-color: #e8f0fe; color: #1a73e8; }
.bg-customers { background-color: #f3e8fd; color: #9c27b0; }
.bg-warning { background-color: #fff0eb; color: #ff6b00; }
.stat-info { display: flex; flex-direction: column; gap: 5px; }
.stat-title { margin: 0; font-size: 0.9rem; color: #666; font-weight: 600; }
.stat-value { margin: 0; font-size: 1.5rem; font-weight: 800; color: #1a251e; }
.text-revenue { color: #4CAF50; }
.text-warning { color: #ff6b00; }

/* LAYOUT GRID CHUNG */
.charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.admin-card { background-color: #ffffff; border-radius: 12px; border: 1px solid #eef3ef; padding: 25px; box-shadow: 0 4px 12px rgba(0,0,0,0.01); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #eef3ef; }
.card-header h3 { margin: 0; font-size: 1.15rem; font-weight: 800; color: #1a251e; display: flex; align-items: center; gap: 10px;}
.card-header h3 i { color: #4CAF50; }

/* BIỂU ĐỒ CỘT DỌC (DOANH THU & KHÁCH HÀNG) */
.css-bar-chart { display: flex; height: 250px; padding-top: 20px; }
.chart-y-axis { display: flex; flex-direction: column; justify-content: space-between; padding-right: 15px; border-right: 1px solid #eef3ef; color: #888; font-size: 0.8rem; font-weight: 600; width: 40px; text-align: right; }
.chart-bars-container { flex: 1; display: flex; justify-content: space-around; align-items: flex-end; padding-left: 10px; }
.bar-wrapper { display: flex; flex-direction: column; align-items: center; gap: 10px; height: 100%; justify-content: flex-end; width: 12%; cursor: pointer; }
.bar-fill { width: 100%; border-radius: 6px 6px 0 0; position: relative; transition: height 1s ease, filter 0.2s; }
.bg-green { background: linear-gradient(to top, #4CAF50, #81c784); }
.bg-purple { background: linear-gradient(to top, #9c27b0, #ce93d8); }
.bar-wrapper:hover .bar-fill { filter: brightness(1.1); box-shadow: 0 0 10px rgba(0,0,0,0.1); }

/* Tooltip Biểu đồ */
.bar-tooltip { position: absolute; top: -35px; left: 50%; transform: translateX(-50%); background-color: #1a251e; color: #fff; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; opacity: 0; visibility: hidden; transition: all 0.2s; white-space: nowrap; z-index: 10; }
.bar-tooltip::after { content: ''; position: absolute; top: 100%; left: 50%; margin-left: -4px; border-width: 4px; border-style: solid; border-color: #1a251e transparent transparent transparent; }
.bar-wrapper:hover .bar-tooltip { opacity: 1; visibility: visible; top: -40px; }
.bar-label { font-size: 0.8rem; color: #666; font-weight: 600; }

/* BIỂU ĐỒ NGANG (TOP SẢN PHẨM) */
.horizontal-chart { display: flex; flex-direction: column; gap: 20px; margin-top: 10px; }
.h-bar-row { cursor: pointer; padding: 5px; border-radius: 8px; transition: background 0.2s; }
.h-bar-row:hover { background-color: #f9fbf9; }
.h-bar-label { display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 700; color: #2c3e50; margin-bottom: 8px; }
.prod-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70%; }
.prod-val { color: #4CAF50; }
.h-bar-track { width: 100%; height: 10px; background-color: #eef3ef; border-radius: 10px; overflow: hidden; }
.h-bar-fill { height: 100%; border-radius: 10px; transition: width 1s ease; }
.bg-blue { background: linear-gradient(to right, #1a73e8, #64b5f6); }

/* BẢNG CHUNG & CẢNH BÁO KHO */
.admin-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
.admin-table th { background-color: #f8faf8; padding: 12px 15px; color: #1a251e; font-weight: 750; border-bottom: 2px solid #eef3ef; }
.admin-table td { padding: 12px 15px; border-bottom: 1px solid #eef3ef; color: #4a554f; }
.warning-table td { background-color: #fffaf7; border-bottom: 1px solid #ffe0cc; }
.bold-text { font-weight: 700; color: #1a251e; }
.stock-alert-num { font-size: 1.1rem; font-weight: 900; color: #ff3b30; }
.stock-badge { padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; }
.badge-warning { background-color: #fff4e5; color: #ff9800; border: 1px solid #ffe0b2; }
.badge-danger { background-color: #fbebe9; color: #ff3b30; border: 1px solid #f5c6cb; }

/* MODAL CHI TIẾT ĐỘNG */
.admin-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; opacity: 0; visibility: hidden; transition: all 0.3s ease; }
.admin-modal-overlay.show { opacity: 1; visibility: visible; }
.admin-modal-box { background-color: white; border-radius: 12px; width: 100%; max-width: 600px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); overflow: hidden; transform: translateY(-20px); transition: transform 0.3s ease; }
.admin-modal-overlay.show .admin-modal-box { transform: translateY(0); }
.modal-header { padding: 20px 25px; background-color: #f8faf8; border-bottom: 1px solid #eef3ef; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { margin: 0; font-size: 1.15rem; font-weight: 800; color: #1a251e; }
.btn-close-modal { background: none; border: none; font-size: 1.8rem; cursor: pointer; color: #aaa; line-height: 1; }
.modal-form-body { padding: 25px; max-height: 60vh; overflow-y: auto; }

/* HIỆU ỨNG */
.animate-fade { animation: fadeIn 0.5s ease backwards; }
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* RESPONSIVE */
@media (max-width: 1024px) { .summary-cards-grid { grid-template-columns: repeat(2, 1fr); } .charts-row { grid-template-columns: 1fr; } }
@media (max-width: 576px) { .summary-cards-grid { grid-template-columns: 1fr; } .chart-bars-container { overflow-x: auto; min-width: 400px; } }
</style>