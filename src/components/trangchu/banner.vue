<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 1. MẢNG DỮ LIỆU BANNER (Cực kỳ dễ tìm, dễ sửa đổi, thêm bớt ảnh ở đây)
const slides = ref([
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80', // Ảnh nhà bếp hiện đại cao cấp
    title: 'GIAN BẾP HIỆN ĐẠI KIT_CHEF',
    description: 'Nâng tầm không gian nấu nướng với những thiết bị nhà bếp đẳng cấp châu Âu.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1600&q=80', // Ảnh món ăn và nồi chảo cao cấp
    title: 'BỘ SƯU TẬP NỒI CHẢO CAO CẤP',
    description: 'Chống dính tuyệt hảo, giữ nhiệt tối ưu, bảo vệ sức khỏe cho cả gia đình bạn.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=1600&q=80', // Ảnh chuẩn bị đồ ăn tinh tế
    title: 'SIÊU ƯU ĐÃI KHAI XUÂN 20%',
    description: 'Sở hữu ngay combo dao kéo cao cấp Nhật Bản với mức giá ưu đãi cực khủng.'
  }
])

// 2. LOGIC HOẠT ĐỘNG CỦA SLIDE (PURE VUE 3)
const currentIndex = ref(0) // Chỉ số slide hiện tại đang hiển thị (bắt đầu từ 0)
let timer = null // Biến lưu bộ đếm thời gian tự động chuyển trang

// Hàm chuyển sang slide tiếp theo
const nextSlide = () => {
  if (currentIndex.value === slides.value.length - 1) {
    currentIndex.value = 0 // Nếu đang ở slide cuối thì quay về slide đầu
  } else {
    currentIndex.value++
  }
}

// Hàm quay lại slide trước đó
const prevSlide = () => {
  if (currentIndex.value === 0) {
    currentIndex.value = slides.value.length - 1 // Nếu đang ở slide đầu thì nhảy về slide cuối
  } else {
    currentIndex.value--
  }
}

// Hàm nhảy trực tiếp đến slide cụ thể khi bấm các dấu chấm (indicators)
const goToSlide = (index) => {
  currentIndex.value = index
}

// Hàm khởi động chế độ tự động chuyển slide sau mỗi 5 giây
const startAutoPlay = () => {
  timer = setInterval(nextSlide, 3000)
}

// Hàm dừng tự động chuyển (khi người dùng rê chuột vào banner hoặc khi chuyển trang để đỡ tốn ram)
const stopAutoPlay = () => {
  if (timer) clearInterval(timer)
}

// VÒNG ĐỜI COMPONENT (LIFECYCLE HOOKS)
onMounted(() => {
  startAutoPlay() // Khi giao diện vừa load xong thì bắt đầu tự chạy slide
})

onUnmounted(() => {
  stopAutoPlay() // Khi chuyển sang trang khác (Đăng ký/Đăng nhập) thì xóa bộ đếm thời gian để tối ưu hiệu năng
})
</script>

<template>
  <!-- Rê chuột vào banner thì tạm dừng tự chạy (stopAutoPlay), bỏ chuột ra thì chạy tiếp (startAutoPlay) -->
  <section 
    class="banner-wrapper" 
    @mouseenter="stopAutoPlay" 
    @mouseleave="startAutoPlay"
  >
    <div class="carousel-container">
      
      <!-- 1. CÁC NÚT DẤU CHẤM (INDICATORS) -->
      <div class="carousel-indicators">
        <button 
          v-for="(slide, index) in slides" 
          :key="slide.id"
          :class="{ 'active': index === currentIndex }"
          @click="goToSlide(index)"
          aria-label="Chuyển slide"
        ></button>
      </div>

      <!-- 2. DANH SÁCH ẢNH VÀ CHỮ (SLIDE ITEMS) -->
      <div class="carousel-inner">
        <div 
          v-for="(slide, index) in slides" 
          :key="slide.id"
          class="carousel-item"
          :class="{ 'active': index === currentIndex }"
        >
          <!-- Ảnh nền của banner -->
          <div class="banner-image-overlay"></div>
          <img :src="slide.image" class="banner-img" :alt="slide.title" />
          
          <!-- Nội dung chữ nổi bật đè lên ảnh -->
          <div class="carousel-caption">
            <h2 class="slide-title">{{ slide.title }}</h2>
            <p class="slide-desc">{{ slide.description }}</p>
            <div class="slide-actions">
              <a href="#" class="btn-banner">Xem Ngay</a>
              <!-- <a href="#" class="btn-banner outline">Khám Phá</a> -->
            </div>
          </div>
        </div>
      </div>

      <!-- 3. HAI NÚT MŨI TÊN QUA LẠI (CONTROLS) -->
      <button class="carousel-control prev" @click="prevSlide" aria-label="Slide trước">
        <i class="fa fa-angle-left"></i>
      </button>
      <button class="carousel-control next" @click="nextSlide" aria-label="Slide sau">
        <i class="fa fa-angle-right"></i>
      </button>

    </div>
  </section>
</template>

<style scoped>
/* KHUNG CHỨA TOÀN BỘ BANNER */
.banner-wrapper {
  background-color: #000;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.carousel-container {
  position: relative;
  width: 100%;
  height: 550px; /* Chiều cao lý tưởng cho banner chính của website */
}

/* DANH SÁCH SLIDE */
.carousel-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0; /* Mặc định ẩn tất cả */
  visibility: hidden;
  transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out; /* Hiệu ứng phai nhạt cực mượt */
  transform: scale(1.02); /* Thu nhỏ nhẹ khi ẩn */
}

/* KHI SLIDE ĐƯỢC CHỌN (ACTIVE) */
.carousel-item.active {
  opacity: 1; /* Hiện ra */
  visibility: visible;
  transform: scale(1); /* Phóng về kích thước chuẩn */
  z-index: 10;
}

/* ẢNH BANNER VÀ LỚP PHỦ TỐI (Tạo độ tương phản cho chữ dễ đọc) */
.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Giúp ảnh không bị méo khi co giãn trình duyệt */
  object-position: center;
}

.banner-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%);
  z-index: 1;
}

/* PHẦN CHỮ NỔI BẬT TRÊN BANNER (CAPTIONS) */
.carousel-caption {
  position: absolute;
  bottom: 15%;
  left: 10%;
  right: 10%;
  z-index: 2;
  text-align: left; /* Căn lề trái trông sang trọng hơn căn giữa */
  max-width: 850px; /* Tăng từ 700px lên 850px để chữ có không gian trải ngang thoải mái */
}

.slide-title {
  font-family: 'Segoe UI', Arial, sans-serif;
  /* Giảm nhẹ kích cỡ tối đa từ 3.2rem xuống 2.5rem để bảo toàn hiển thị không bị rơi chữ */
  font-size: clamp(1.8rem, 3.8vw, 2.5rem); 
  font-weight: 850;
  line-height: 1.2; /* Thiết lập khoảng cách dòng tối ưu tránh đè chữ */
  color: #ffffff;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.6);
  letter-spacing: 1px;
}

.slide-desc {
  font-size: 1.25rem;
  color: #dddddd;
  margin-bottom: 30px;
  line-height: 1.6;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}

/* NÚT HÀNH ĐỘNG TRÊN BANNER */
.slide-actions {
  display: flex;
  gap: 15px;
}

.btn-banner {
  display: inline-block;
  padding: 12px 30px;
  background-color: #4CAF50; /* Đồng bộ màu xanh lá của KitChef */
  color: white;
  font-weight: bold;
  text-decoration: none;
  border-radius: 30px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
}

.btn-banner:hover {
  background-color: #45a049;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.6);
}

.btn-banner.outline {
  background-color: transparent;
  border: 2px solid #ffffff;
  color: #ffffff;
  box-shadow: none;
}

.btn-banner.outline:hover {
  background-color: #ffffff;
  color: #000000;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.2);
}

/* 3. NÚT ĐIỀU HƯỚNG MŨI TÊN (CONTROLS) */
.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px); /* Làm mờ kính cực kỳ cao cấp */
}

.carousel-control:hover {
  background-color: #4CAF50;
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.5);
}

.carousel-control.prev {
  left: 30px;
}

.carousel-control.next {
  right: 30px;
}

/* 4. DẤU CHẤM TRÒN PHÂN TRANG (INDICATORS) */
.carousel-indicators {
  position: absolute;
  bottom: 30px;
  right: 30px; /* Đặt ở góc phải cho gọn gàng */
  display: flex;
  gap: 10px;
  z-index: 15;
}

.carousel-indicators button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-indicators button.active {
  background-color: #4CAF50;
  width: 30px; /* Hiệu ứng dẹt dài ra khi active cực kỳ hiện đại */
  border-radius: 6px;
  box-shadow: 0 0 8px #4CAF50;
}

/* PHẦN ĐIỆN THOẠI (RESPONSIVE) */
@media (max-width: 768px) {
  .carousel-container {
    height: 400px;
  }
  
  .slide-title {
    line-height: 1.25;
  }
  
  .slide-desc {
    font-size: 1rem;
    margin-bottom: 20px;
  }

  .carousel-control {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
  
  .carousel-control.prev {
    left: 10px;
  }

  .carousel-control.next {
    right: 10px;
  }
}
</style>