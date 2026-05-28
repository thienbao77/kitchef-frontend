<script setup>
// Footer tĩnh
</script>

<template>
  <footer class="footer-wrapper">
    
    <div class="footer-top-section">
      <div class="container">
        <div class="footer-top-grid">
          
          <div class="footer-col">
            <h4>Hỗ Trợ Khách Hàng</h4>
            <ul class="footer-links">
              <li><a href="#">Chính Sách Vận Chuyển</a></li>
              <li><a href="#">Chính Sách Thanh Toán</a></li>
              <li><a href="#">Chính Sách Đổi Trả Hoàn Tiền</a></li>
              <li><a href="#">Chính Sách Bảo Hành</a></li>
              <li><a href="#">Chính Sách Bảo Mật</a></li>
              <li><a href="#">Chính Sách Xử Lý Khiếu Nại</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Về Chúng Tôi</h4>
            <ul class="footer-links">
              <li><a href="#">Giới Thiệu</a></li>
              <li><a href="#">Dịch Vụ Của KitChef</a></li>
              <li><a href="#">Tuyển Dụng</a></li>
              <li><a href="#">Chăm Sóc Khách Hàng</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Hỗ Trợ Bán Hàng</h4>
            <ul class="footer-links">
              <li><a href="tel:0905912074">Hỗ trợ bảo hành: 0905912074</a></li>
              <li><a href="tel:0905912074">Tư vấn mua hàng: 0905912074</a></li>
              <li><a href="#">Dịch vụ bảo dưỡng thiết bị bếp: 0905912074</a></li>
              <li><a href="#">Chính Sách Bảo Hành</a></li>
              <li><a href="tel:0905912074">Phản ánh thái độ phục vụ: 0905912074</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Kết Nối Với KitChef</h4>
            <div class="iframe-container">
              <iframe
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Faqdesign.vn&tabs=timeline&width=340&height=500&small_header=true&adapt_container_width=true&hide_cover=true&show_facepile=true&appId"
                width="100%"
                height="200"
                style="border: none; overflow: hidden; border-radius: 8px;"
                scrolling="no"
                frameborder="0"
                allowTransparency="true"
                allow="encrypted-media"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom-section">
      <div class="container">
        <div class="footer-bottom-grid">
          
          <div class="store-col">
            <h4><i class="fa fa-map-marker mr-2" aria-hidden="true"></i> Chi nhánh 1</h4>
            <ul class="store-info">
              <li><strong>Địa chỉ:</strong> 464 Quang Trung - TP. Hà Nội</li>
              <li><strong>Hotline:</strong> 0905912074</li>
              <li><strong>Email:</strong> binhhayho@gmail.com</li>
            </ul>
          </div>

          <div class="store-col">
            <h4><i class="fa fa-map-marker mr-2" aria-hidden="true"></i> Chi nhánh 2</h4>
            <ul class="store-info">
              <li><strong>Địa chỉ:</strong> 13 Phan Tây Nhạc - TP. Hà Nội</li>
              <li><strong>Hotline:</strong> 0905912074</li>
              <li><strong>Email:</strong> binhhayho@gmail.com</li>
            </ul>
          </div>

          <div class="store-col">
            <h4><i class="fa fa-map-marker mr-2" aria-hidden="true"></i> Chi nhánh 3</h4>
            <ul class="store-info">
              <li><strong>Địa chỉ:</strong> 148 Trần Duy Hưng - TP. Hà Nội</li>
              <li><strong>Hotline:</strong> 0905912074</li>
              <li><strong>Email:</strong> binhhayho@gmail.com</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
    
    <div class="copyright-bar">
      <p>© 2026 KitChef - Hệ thống phân phối thiết bị nhà bếp cao cấp. Bảo lưu mọi quyền.</p>
    </div>
  </footer>
</template>

<style scoped>
/* TỔNG THỂ FOOTER */
.footer-wrapper {
  color: #dddddd;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  border-top: 4px solid #4CAF50; /* Viền xanh lá tạo điểm nhấn */
}

.container {
  max-width: 1250px;
  margin: 0 auto;
  padding: 0 20px;
}

h4 {
  color: #ffffff;
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

h4 i {
  color: #4CAF50;
}

.mr-2 {
  margin-right: 8px;
}

/* =========================================
   PHẦN 1: FOOTER TOP (#1a1a1a - Giống under-header)
   ========================================= */
.footer-top-section {
  background-color: #1a1a1a;
  padding: 60px 0 50px 0;
}

.footer-top-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #aaaaaa;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  display: inline-block;
}

.footer-links a:hover {
  color: #4CAF50;
  transform: translateX(5px);
}

.iframe-container {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  padding: 5px;
}

/* =========================================
   PHẦN 2: FOOTER BOTTOM (#111111 - Giống top-header)
   ========================================= */
.footer-bottom-section {
  background-color: #111111;
  padding: 50px 0 40px 0;
  border-top: 1px solid #222222; /* Đường line mỏng phân cách nếu cần */
}

.footer-bottom-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.store-info {
  list-style: none;
  padding: 0;
  margin: 0;
}

.store-info li {
  font-size: 0.9rem;
  color: #aaaaaa;
  margin-bottom: 8px;
  line-height: 1.5;
}

.store-info strong {
  color: #ffffff;
}

/* =========================================
   THANH COPYRIGHT DƯỚI CÙNG
   ========================================= */
.copyright-bar {
  background-color: #080808; /* Đen tuyền nhất ở đáy */
  text-align: center;
  padding: 15px 0;
  border-top: 1px solid #1a1a1a;
}

.copyright-bar p {
  margin: 0;
  font-size: 0.85rem;
  color: #777777;
}

/* =========================================
   RESPONSIVE (ĐIỆN THOẠI & TABLET)
   ========================================= */
@media (max-width: 992px) {
  .footer-top-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .footer-bottom-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .footer-top-grid, .footer-bottom-grid {
    grid-template-columns: 1fr;
  }
  .footer-top-section {
    padding: 40px 0 30px 0;
  }
  .footer-bottom-section {
    padding: 30px 0 20px 0;
  }
}
</style>