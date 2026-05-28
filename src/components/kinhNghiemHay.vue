<script setup>
import { ref } from 'vue'

// DỮ LIỆU GIẢ LẬP CHO CÁC BÀI VIẾT BLOG/MẸO VẶT (3 bài nổi bật nhất)
const articles = ref([
  {
    id: 1,
    title: 'Bí quyết bảo quản chảo chống dính luôn như mới',
    excerpt: 'Chảo chống dính rất dễ bị hỏng lớp phủ nếu không biết cách chăm sóc. Cùng tìm hiểu 5 nguyên tắc vàng để kéo dài tuổi thọ cho chiếc chảo yêu quý của bạn.',
    category: 'Mẹo Bếp Núc',
    date: '24 Tháng 05, 2026',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    title: 'Phân biệt các loại dao Nhật và công dụng từng loại',
    excerpt: 'Santoku, Nakiri hay Gyuto? Việc hiểu rõ đặc tính của từng loại dao Damascus sẽ giúp bạn thái gọt thực phẩm chuẩn xác và tiết kiệm sức lực hơn.',
    category: 'Kiến Thức Dụng Cụ',
    date: '20 Tháng 05, 2026',
    image: 'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    title: 'Gợi ý setup không gian bếp phong cách Minimalism tối giản',
    excerpt: 'Không cần quá nhiều đồ đạc, chỉ với những vật dụng thiết yếu được sắp xếp thông minh, gian bếp của bạn sẽ trở nên tinh tế và ngập tràn cảm hứng.',
    category: 'Cảm Hứng Không Gian',
    date: '15 Tháng 05, 2026',
    image: 'https://images.unsplash.com/photo-1556911261-6bd341186b2f?auto=format&fit=crop&w=600&q=80'
  }
])
</script>

<template>
  <section class="blog-section">
    <div class="container">
      
      <div class="section-header">
        <span class="sub-title">Góc Chia Sẻ</span>
        <h2 class="main-title">KINH NGHIỆM HAY</h2>
        <div class="divider"></div>
      </div>

      <div class="blog-grid">
        <article 
          v-for="article in articles" 
          :key="article.id" 
          class="blog-card"
        >
          <a href="#" class="blog-image-link">
            <div class="blog-image-box">
              <img :src="article.image" :alt="article.title" class="blog-img" />
              <span class="blog-category">{{ article.category }}</span>
            </div>
          </a>

          <div class="blog-content">
            <div class="blog-meta">
              <i class="fa-regular fa-calendar"></i>
              <span>{{ article.date }}</span>
            </div>
            
            <h3 class="blog-title">
              <a href="#">{{ article.title }}</a>
            </h3>
            
            <p class="blog-excerpt">{{ article.excerpt }}</p>
            
            <a href="#" class="read-more-btn">
              Xem chi tiết <i class="fa-solid fa-arrow-right-long"></i>
            </a>
          </div>
        </article>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* CONTAINER CHUNG */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* KHU VỰC NỀN XÁM NHẠT (XEN KẼ VỚI SP BÁN CHẠY) */
.blog-section {
  padding: 80px 0;
  background-color: #f9fbf9; /* Màu nền xám xanh nhạt */
}

/* TIÊU ĐỀ PHÂN KHU */
.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.sub-title {
  color: #4CAF50; 
  font-size: 0.85rem;
  font-weight: 750;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: block;
  margin-bottom: 8px;
}

.main-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a251e;
  margin: 0;
  letter-spacing: 0.5px;
}

.divider {
  width: 60px;
  height: 3px;
  background-color: #4CAF50;
  margin: 15px auto 0;
  border-radius: 2px;
}

/* LƯỚI BÀI VIẾT */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Chia 3 cột đều nhau */
  gap: 30px;
}

/* THẺ BÀI VIẾT (CARD) */
.blog-card {
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.03);
  transition: all 0.3s ease;
  border: 1px solid #eef3ef;
  display: flex;
  flex-direction: column;
}

.blog-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.08);
}

/* KHUNG ẢNH VÀ HIỆU ỨNG ZOOM */
.blog-image-box {
  width: 100%;
  height: 240px;
  overflow: hidden;
  position: relative;
}

.blog-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.blog-card:hover .blog-img {
  transform: scale(1.08); /* Phóng to ảnh nhẹ nhàng khi hover card */
}

/* NHÃN DANH MỤC */
.blog-category {
  position: absolute;
  bottom: 15px;
  left: 15px;
  background-color: #4CAF50;
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
}

/* NỘI DUNG CHỮ BÊN DƯỚI */
.blog-content {
  padding: 25px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.blog-meta {
  font-size: 0.85rem;
  color: #888888;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.blog-meta i {
  color: #4CAF50;
}

.blog-title {
  font-size: 1.25rem;
  font-weight: 750;
  line-height: 1.4;
  margin: 0 0 15px 0;
}

.blog-title a {
  color: #1a251e;
  text-decoration: none;
  transition: color 0.3s ease;
}

.blog-title a:hover {
  color: #4CAF50;
}

.blog-excerpt {
  color: #5c6a60;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0 0 20px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Cắt bớt chữ nếu dài quá 3 dòng */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* NÚT XEM CHI TIẾT */
.read-more-btn {
  margin-top: auto; /* Đẩy nút này xuống dưới cùng của card */
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #1a251e;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.read-more-btn i {
  font-size: 0.9rem;
  transition: transform 0.3s ease;
}

.read-more-btn:hover {
  color: #4CAF50;
}

.read-more-btn:hover i {
  transform: translateX(5px); /* Mũi tên trượt sang phải */
}

/* RESPONSIVE MÀN HÌNH NHỎ */
@media (max-width: 992px) {
  .blog-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 cột trên Tablet */
  }
}

@media (max-width: 768px) {
  .blog-grid {
    grid-template-columns: 1fr; /* 1 cột trên điện thoại */
  }
  
  .blog-image-box {
    height: 220px;
  }
  
  .main-title {
    font-size: 1.6rem;
  }
  
  .blog-section {
    padding: 50px 0;
  }
}
</style>