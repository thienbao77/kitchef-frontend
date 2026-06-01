<script setup>
import { ref } from 'vue'

// Mảng danh mục khớp 100% với cấu trúc dữ liệu của bạn
const categories = ref([
  {
    id: 1,
    name: 'Nồi, Chảo',
    // Ảnh nồi chảo gang cao cấp tinh tế
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=200&q=80',
    link: '#/noi-chao',
    slug: 'noi-chao'
  },
  {
    id: 2,
    name: 'Dao, Kéo',
    // Ảnh bộ dao Damascus Nhật Bản sắc sảo
    image: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=200&q=80',
    link: '#/dao-keo',
    slug: 'dao-keo'
  },
  {
    id: 3,
    name: 'Tô, Chén, Đĩa',
    // Ảnh bộ chén đĩa gốm sứ trắng viền vàng cực sang
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=200&q=80',
    link: '#/to-chen-dia',
    slug: 'to-chen-dia'
  },
  {
    id: 4,
    name: 'Phụ kiện ăn',
    // Ảnh đũa, muỗng, nĩa gỗ decor sang trọng
    image: 'https://images.unsplash.com/photo-1542382257-201b7f816a46?auto=format&fit=crop&w=200&q=80',
    link: '#/phu-kien-an',
    slug: 'phu-kien-an'
  },
  {
    id: 5,
    name: 'Phụ kiện bếp',
    // Ảnh kệ tre, móc treo xếp đồ dùng bếp gọn gàng
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=200&q=80',
    link: '#/phu-kien-bep',
    slug: 'phu-kien-bep'
  },
  {
    id: 6,
    name: 'Khác',
    // Ảnh thớt gỗ, hũ đựng gia vị decor xinh xắn
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=200&q=80',
    link: '#/khac',
    slug: 'khac'
  }
])
</script>

<template>
  <!-- KHU VỰC DANH MỤC SẢN PHẨM HÀNG NGANG (TRẮNG - XANH LÁ) -->
  <section class="categories-section">
    <div class="container">
      
      <!-- TIÊU ĐỀ PHÂN KHU -->
      <div class="section-header">
        <span class="sub-title">Khám Phá Gian Bếp</span>
        <div class="divider"></div>
      </div>

      <!-- THANH DANH MỤC TRÊN CÙNG MỘT HÀNG NGANG -->
      <div class="categories-row-container">
        <div class="categories-row">
          <a 
            v-for="cat in categories" 
            :key="cat.id" 
            :href="cat.link"
            class="category-item-link"
          >
            <div class="category-item">
              <!-- Vòng tròn nhỏ chứa ảnh đại diện danh mục -->
              <div class="icon-circle">
                <img :src="cat.image" :alt="cat.name" class="category-thumb" />
              </div>
              <!-- Tên danh mục bên dưới -->
              <span class="category-label">{{ cat.name }}</span>
            </div>
          </a>
        </div>
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

/* TIÊU ĐỀ KHU VỰC */
.section-header {
  text-align: center;
  margin-bottom: 35px;
}

.sub-title {
  color: #4CAF50; /* Màu xanh lá thương hiệu KitChef */
  font-size: 0.8rem;
  font-weight: 750;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: block;
  margin-bottom: 8px;
}

/* Đường gạch trang trí dưới tiêu đề */
.divider {
  width: 50px;
  height: 3px;
  background-color: #4CAF50;
  margin: 12px auto 0;
  border-radius: 2px;
}

/* THIẾT KẾ CỤM DANH MỤC HÀNG NGANG */
.categories-section {
  padding: 45px 0;
  background-color: #ffffff; /* Nền trắng tinh tế, sạch sẽ */
  border-bottom: 1px solid #f0f4f1;
}

/* Khung cuộn ngang mượt mà cho điện thoại */
.categories-row-container {
  width: 100%;
  overflow-x: auto;
  scrollbar-width: none; /* Ẩn thanh cuộn trên Firefox */
}

.categories-row-container::-webkit-scrollbar {
  display: none; /* Ẩn thanh cuộn trên Chrome, Safari, Edge */
}

.categories-row {
  display: flex;
  justify-content: center; /* Căn giữa trên Desktop */
  gap: 40px; /* Khoảng cách thông thoáng */
  padding: 10px 0;
  min-width: max-content; /* Đảm bảo các khối không bị ép méo chữ */
  margin: 0 auto;
}

.category-item-link {
  text-decoration: none;
}

/* Từng khối phần tử danh mục */
.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  width: 110px;
}

/* Vòng tròn ảnh minh họa nhỏ nhắn */
.icon-circle {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  background-color: #f4fbf6; /* Màu nền vòng tròn xanh lá cực nhạt */
  border: 2px solid #e1ebe3; /* Viền xám mỏng tinh tế */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.category-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

/* Nhãn chữ bên dưới */
.category-label {
  margin-top: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a554f; /* Màu chữ xám xanh dịu nhẹ */
  text-align: center;
  white-space: nowrap;
  transition: all 0.3s ease;
}

/* HIỆU ỨNG HOVER KHI RÊ CHUỘT (TÔNG TRẮNG - XANH LÁ) */
.category-item:hover .icon-circle {
  border-color: #4CAF50; /* Đổi viền sang màu xanh lá thương hiệu */
  transform: translateY(-5px); /* Nảy nhẹ vòng tròn lên 3D */
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.15); /* Tỏa bóng mờ xanh nhạt */
  background-color: #ffffff;
}

.category-item:hover .category-thumb {
  transform: scale(1.1); /* Phóng to nhẹ ảnh bên trong vòng tròn */
}

.category-item:hover .category-label {
  color: #4CAF50; /* Tiêu đề chuyển sang màu xanh lá nổi bật */
  font-weight: 700;
}

/* RESPONSIVE (MÁY TÍNH BẢNG & ĐIỆN THOẠI DI ĐỘNG) */
@media (max-width: 768px) {
  .categories-row {
    justify-content: flex-start; /* Xếp lệch trái trên mobile để cuộn ngang tự nhiên */
    padding: 10px 15px;
    gap: 25px;
  }

  .icon-circle {
    width: 75px; /* Thu nhỏ nhẹ vòng tròn ảnh trên mobile */
    height: 75px;
  }

  .category-item {
    width: 95px;
  }

  .main-title {
    font-size: 1.5rem;
  }

  .categories-section {
    padding: 30px 0;
  }
}
</style>