<script setup>
// Không cần xử lý logic dữ liệu phức tạp cho trang giới thiệu tĩnh
</script>

<template>
  <div class="about-page">
    <div class="about-hero">
      <div class="container">
        <h1>VỀ CHÚNG TÔI - KITCHEF</h1>
        <p>Giải pháp cung cấp dụng cụ gian bếp tối giản, sang trọng và chuẩn mực hóa đơn rõ ràng.</p>
      </div>
    </div>

    <div class="container about-body">
      <div class="about-section">
        <div class="about-text">
          <h2>Câu Chuyện Thương Hiệu</h2>
          <p>Được thành lập với sứ mệnh mang đến không gian nấu nướng hiện đại, KitChef không chỉ cung cấp sản phẩm cao cấp như thép Đức, gốm Bắc Âu, chúng tôi mang tới trải nghiệm mua sắm số hóa toàn diện và an tâm tuyệt đối.</p>
          <p>Mọi quy trình từ tạo đơn hàng, tính toán chi phí vận chuyển nội/ngoại thành đến xuất hóa đơn điện tử VAT đều được quản lý tự động, minh bạch và chính xác bằng hệ thống công nghệ tiên tiến.</p>
        </div>
        <div class="about-image">
          <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80" alt="Kitchen Concept" />
        </div>
      </div>

      <div class="commitments-grid">
        <div class="commit-card">
          <i class="fa-solid fa-shield-halved commit-icon"></i>
          <h3>Cam Kết Chất Lượng</h3>
          <p>100% sản phẩm chính hãng nhập khẩu nguyên khối, an toàn tuyệt đối cho sức khỏe người sử dụng.</p>
        </div>
        <div class="commit-card">
          <i class="fa-solid fa-file-invoice-dollar commit-icon"></i>
          <h3>Hóa Đơn Minh Bạch</h3>
          <p>Hệ thống tự động đồng bộ chi phí, áp dụng chính xác mã giảm giá và cung cấp lịch sử thanh toán chi tiết.</p>
        </div>
        <div class="commit-card">
          <i class="fa-solid fa-truck-fast commit-icon"></i>
          <h3>Giao Hàng Siêu Tốc</h3>
          <p>Phân tách biểu phí vận chuyển khu vực thông minh, đóng gói chống sốc chuyên nghiệp kiểm hàng trước khi trả tiền.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-page { background-color: #f9fbf9; min-height: 100vh; font-family: sans-serif; padding-bottom: 60px; }
.about-hero { background: linear-gradient(135deg, #1a251e 0%, #000000 100%); color: #fff; padding: 60px 0; text-align: center; }
.about-hero h1 { color: #4CAF50; font-size: 2.2rem; font-weight: 850; margin-bottom: 10px; }
.about-hero p { color: #cccccc; font-size: 1rem; }

.about-body { margin-top: 50px; }
.about-section { display: flex; gap: 40px; align-items: center; margin-bottom: 60px; }
.about-text { flex: 1; }
.about-text h2 { font-size: 1.6rem; color: #1a251e; margin-bottom: 15px; font-weight: 750; }
.about-text p { color: #5c6a60; line-height: 1.6; font-size: 0.95rem; margin-bottom: 15px; }

.about-image { flex: 1; }
.about-image img { width: 100%; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.05); }

.commitments-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.commit-card { background: #fff; padding: 30px 20px; border-radius: 12px; border: 1px solid #eef3ef; text-align: center; transition: transform 0.2s; }
.commit-card:hover { transform: translateY(-5px); }
.commit-icon { font-size: 2.5rem; color: #4CAF50; margin-bottom: 15px; }
.commit-card h3 { font-size: 1.1rem; color: #1a251e; margin-bottom: 10px; font-weight: 700; }
.commit-card p { font-size: 0.85rem; color: #666; line-height: 1.5; margin: 0; }

@media (max-width: 768px) {
  .about-section { flex-direction: column; }
  .commitments-grid { grid-template-columns: 1fr; }
}
</style>