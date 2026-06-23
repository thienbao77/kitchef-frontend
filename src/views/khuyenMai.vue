<script setup>
import { ref } from 'vue'

// Dữ liệu giả lập Voucher tác động trực tiếp vào thực thể Hóa đơn (Invoices)
const vouchers = ref([
  {
    id: 'VCH10',
    title: 'GIẢM TỔNG HÓA ĐƠN',
    discount: 'Giảm 10%',
    desc: 'Áp dụng cho hóa đơn dụng cụ bếp từ 1.000.000 đ trở lên.',
    expiry: 'Hạn dùng: 30/06/2026',
    saved: false,
    type: 'invoice'
  },
  {
    id: 'FREESHIP',
    title: 'MIỄN PHÍ VẬN CHUYỂN',
    discount: 'Freeship 35k',
    desc: 'Áp dụng cho mọi hóa đơn thanh toán trực tuyến qua thẻ/ví.',
    expiry: 'Hạn dùng: 15/06/2026',
    saved: true,
    type: 'shipping'
  },
  {
    id: 'KITCHEN50k',
    title: 'ƯU ĐÃI THÀNH VIÊN MỚI',
    discount: 'Trừ trực tiếp 50.000đ',
    desc: 'Giảm ngay vào hóa đơn đầu tiên khi đăng ký tài khoản thành công.',
    expiry: 'Hạn dùng: Vô thời hạn',
    saved: false,
    type: 'invoice'
  }
])

const collectVoucher = (vch) => {
  vch.saved = true
  alert(`Đã lưu mã ${vch.id} vào tài khoản! Mã này sẽ tự động gợi ý tại bước thanh toán hóa đơn.`)
}
</script>

<template>
  <div class="promo-page">
    <div class="shop-hero">
      <div class="container">
        <div class="breadcrumb">
          <RouterLink to="/">Trang chủ</RouterLink>
          <i class="fa-solid fa-angle-right">></i>
          <span>Khuyến mãi</span>
        </div>
        <h1>Khuyễn mãi hấp dẫn, săn mã giảm giá lên đến 50%</h1>
        <p></p>
      </div>
    </div>

    <div class="container promo-body">
      <div class="voucher-grid">
        <div v-for="vch in vouchers" :key="vch.id" class="voucher-card" :class="{ 'collected': vch.saved }">
          <div class="voucher-left">
            <div class="circle-cut top"></div>
            <span class="voucher-tag">{{ vch.type === 'invoice' ? 'Hóa Đơn' : 'Vận Chuyển' }}</span>
            <h2 class="discount-txt">{{ vch.discount }}</h2>
            <div class="circle-cut bottom"></div>
          </div>
          
          <div class="voucher-right">
            <h3 class="voucher-title">{{ vch.title }}</h3>
            <p class="voucher-desc">{{ vch.desc }}</p>
            <div class="voucher-footer">
              <span class="expiry-date">{{ vch.expiry }}</span>
              <button @click="collectVoucher(vch)" :disabled="vch.saved" class="btn-collect">
                {{ vch.saved ? 'Đã thu thập ✓' : 'Lưu mã' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.promo-page { background-color: #f9fbf9; min-height: 100vh; font-family: sans-serif; padding-bottom: 60px; }
.promo-hero { background: linear-gradient(135deg, #fff0f0 0%, #ffffff 100%); padding: 50px 0; border-bottom: 1px solid #f2e3e3; text-align: center; margin-bottom: 40px;}
.promo-hero h1 { color: #d63031; font-weight: 800; font-size: 2rem; margin-bottom: 10px; }
.promo-hero p { color: #636e72; }
.voucher-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; }

.voucher-card { display: flex; background: #fff; border: 1px solid #e1ebe3; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
.voucher-card.collected { border-color: #cedbd0; opacity: 0.85; }

.voucher-left { background-color: #4CAF50; color: #fff; padding: 30px 20px; display: flex; flex-direction: column; justify-content: center; align-items: center; min-width: 160px; position: relative; text-align: center;}
.voucher-card.collected .voucher-left { background-color: #718093; }
.discount-txt { font-size: 1.3rem; font-weight: 800; margin: 5px 0 0 0; }
.voucher-tag { font-size: 0.7rem; background: rgba(255,255,255,0.25); padding: 2px 8px; border-radius: 10px; font-weight: bold; }

.circle-cut { position: absolute; width: 16px; height: 16px; background-color: #f9fbf9; border-radius: 50%; right: -8px; }
.circle-cut.top { top: -8px; }
.circle-cut.bottom { bottom: -8px; }

.voucher-right { padding: 20px 25px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
.voucher-title { font-size: 1.1rem; font-weight: 700; color: #1a251e; margin: 0 0 8px 0; }
.voucher-desc { font-size: 0.85rem; color: #666; margin: 0 0 15px 0; line-height: 1.4; }
.voucher-footer { display: flex; justify-content: space-between; align-items: center; }
.expiry-date { font-size: 0.75rem; color: #999; font-weight: 600; }

.btn-collect { background-color: #1a251e; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s; }
.btn-collect:hover:not(:disabled) { background-color: #4CAF50; }
.btn-collect:disabled { background-color: #eeecec; color: #aaa; cursor: not-allowed; }

.container {
  max-width: 1250px;
  margin: 0 auto;
  padding: 0 20px;
}

.shop-hero {
  background: linear-gradient(135deg, #e8f5ec 0%, #ffffff 100%);
  border-bottom: 1px solid #e1ebe3;
  padding: 40px 0;
  margin-bottom: 30px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  margin-bottom: 15px;
}

.breadcrumb a {
  color: #5c6a60;
  text-decoration: none;
  font-weight: 600;
}

.breadcrumb span {
  color: #4CAF50;
  font-weight: 700;
}

.shop-hero h1 {
  font-size: 2rem;
  font-weight: 850;
  color: #1a251e;
  margin: 0 0 10px 0;
}

.shop-hero p {
  color: #5c6a60;
  font-size: 1rem;
}

.shop-control-bar {
  background-color: #ffffff;
  border: 1px solid #eef3ef;
  border-radius: 12px;
  padding: 15px 25px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-input-mini {
  padding: 8px 15px;
  border: 1px solid #cedbd0;
  border-radius: 6px;
  width: 250px;
  outline: none;
}

.search-input-mini:focus {
  border-color: #4CAF50;
}

@media (max-width: 768px) { .voucher-grid { grid-template-columns: 1fr; } }
</style>