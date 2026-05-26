<script setup>
import { ref } from 'vue'
import axios from 'axios' // Đã chuẩn bị sẵn để kết nối với Spring Boot sau này

// 1. Khai báo các biến phản xạ để hứng dữ liệu đăng nhập từ người dùng
const email = ref('')
const password = ref('')

// Biến lưu trạng thái thông báo
const message = ref('')
const isSuccess = ref(false)

// 2. Hàm xử lý sự kiện khi nhấn nút "Đăng Nhập"
const handleLogin = async () => {
  message.value = "Đang kiểm tra thông tin đăng nhập..."

  const loginData = {
    email: email.value,
    password: password.value
  }

  try {
    // 🚚 Sau này có Backend Spring Boot bạn chỉ cần mở dòng này ra:
    // const response = await axios.post('http://localhost:8080/api/login', loginData)
    
    // Giả lập đăng nhập thành công để kiểm tra giao diện trước
    if (email.value === "admin@gmail.com" && password.value === "123456") {
      message.value = "Đăng nhập thành công! Đang chuyển hướng..."
      isSuccess.value = true
    } else {
      message.value = "Sai email hoặc mật khẩu! (Thử: admin@gmail.com / 123456)"
      isSuccess.value = false
    }
  } catch (error) {
    message.value = "Kết nối đến máy chủ thất bại! Vui lòng thử lại sau."
    isSuccess.value = false
    console.error(error)
  }
}
</script>

<template>
  <div class="login-wrapper">
    <!-- 
      @submit.prevent="handleLogin" 
      Ngăn trình duyệt reload lại trang và gọi hàm xử lý đăng nhập ngầm
    -->
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="container">
        <h1>ĐĂNG NHẬP</h1>
        <p>Vui lòng điền thông tin để đăng nhập vào hệ thống.</p>
        <hr>

        <!-- Hộp thông báo hiển thị lỗi hoặc trạng thái thành công -->
        <div v-if="message" :class="['alert-box', isSuccess ? 'alert-success' : 'alert-error']">
          {{ message }}
        </div>

        <!-- Liên kết dữ liệu trực tiếp bằng v-model -->
        <label for="email"><b>Email</b></label>
        <input 
          type="text" 
          placeholder="Nhập Email" 
          id="email" 
          v-model="email" 
          required
        >

        <label for="psw"><b>Mật Khẩu</b></label>
        <input 
          type="password" 
          placeholder="Nhập Mật Khẩu" 
          id="psw" 
          v-model="password" 
          required
        >
        <hr>

        <p>Bằng cách đăng nhập vào tài khoản, bạn đồng ý với <a href="#">Điều khoản & Quyền riêng tư</a> của chúng tôi.</p>
        <button type="submit" class="loginbtn">Đăng Nhập</button>
      </div>

      <div class="container signup-redirect">
        <p>Chưa có tài khoản? <RouterLink to="/dang-ky">Đăng ký ngay</RouterLink>.</p>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Scoped đảm bảo CSS không bị xung đột với các trang khác */
.login-wrapper {
  font-family: Arial, Helvetica, sans-serif;
  background-color: #000;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.login-form {
  width: 100%;
  max-width: 700px; /* Tối ưu hóa hiển thị responsive thay vì 1500px */
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

/* Đệm lề bên trong container */
.container {
  padding: 30px;
  background-color: white;
}

/* Thiết lập cho các ô nhập liệu rộng 100% */
input[type=text], input[type=password] {
  width: 100%;
  padding: 15px;
  margin: 8px 0 22px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f1f1f1;
  box-sizing: border-box;
}

input[type=text]:focus, input[type=password]:focus {
  background-color: #ddd;
  outline: none;
}

/* Đường gạch ngang phân cách */
hr {
  border: 1px solid #f1f1f1;
  margin-bottom: 25px;
}

/* Kiểu dáng nút bấm Đăng Nhập */
.loginbtn {
  background-color: #4CAF50;
  color: white;
  padding: 16px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  opacity: 0.9;
  font-size: 1rem;
  font-weight: bold;
}

.loginbtn:hover {
  opacity: 1;
}

/* Thiết lập màu liên kết */
a {
  color: dodgerblue;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

/* Phần chuyển hướng sang trang đăng ký */
.signup-redirect {
  background-color: #f1f1f1;
  text-align: center;
  border-top: 1px solid #e1e1e1;
}

/* Thiết kế hộp thông báo trạng thái */
.alert-box {
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.9rem;
}
.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>