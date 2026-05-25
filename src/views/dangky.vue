<script setup>
import { ref } from 'vue'
import axios from 'axios' // Đã chuẩn bị sẵn để gọi API sau này

// 1. Khai báo các biến phản xạ (Reactive State) để hứng dữ liệu từ Form
const email = ref('')
const phone = ref('') // Thêm biến hứng số điện thoại
const password = ref('')
const passwordRepeat = ref('')

// Biến lưu thông báo lỗi hoặc thành công hiển thị lên giao diện
const message = ref('')
const isSuccess = ref(false)

// 2. Hàm xử lý khi người dùng nhấn nút "Đăng Ký"
const handleRegister = async () => {
  // Kiểm tra mật khẩu lặp lại xem có khớp không trước khi gửi lên Backend
  if (password.value !== passwordRepeat.value) {
    message.value = "Mật khẩu nhập lại không trùng khớp!"
    isSuccess.value = false
    return
  }

  // Gom dữ liệu sạch sẽ chuẩn bị gửi sang Spring Boot
  const registerData = {
    email: email.value,
    phone: phone.value, // Đưa số điện thoại vào dữ liệu gửi đi
    password: password.value
  }

  try {
    message.value = "Đang xử lý đăng ký..."
    
    // 🚚 Gửi dữ liệu thật sang Spring Boot (khi bạn làm xong Backend)
    // const response = await axios.post('http://localhost:8080/api/register', registerData)
    
    // Giả lập thành công lúc chưa có database
    message.value = "Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay."
    isSuccess.value = true
    
    // Xóa sạch form sau khi đăng ký thành công
    email.value = ''
    phone.value = ''
    password.value = ''
    passwordRepeat.value = ''
    
  } catch (error) {
    message.value = "Đăng ký thất bại! Lỗi kết nối hoặc email đã tồn tại."
    isSuccess.value = false
    console.error(error)
  }
}
</script>

<template>
  <div class="register-wrapper">
    <!-- 
      @submit.prevent="handleRegister" 
      Nghĩa là: Khi bấm nút Submit, ngăn không cho trình duyệt reload lại trang 
      và lập tức chạy cái hàm handleRegister() ở phần script bên trên.
    -->
    <form @submit.prevent="handleRegister" class="register-form">
      <div class="container">
        <h1>ĐĂNG KÝ</h1>
        <p>Vui lòng điền vào mẫu này để tạo một tài khoản.</p>
        <hr>

        <!-- Hiển thị thông báo trạng thái đăng ký nếu có -->
        <div v-if="message" :class="['alert-box', isSuccess ? 'alert-success' : 'alert-error']">
          {{ message }}
        </div>

        <!-- 
          v-model="email" 
          Liên kết 2 chiều: Khách gõ gì vào ô này, biến 'email' trong script tự động thay đổi theo 
        -->
        <label for="email"><b>Email</b></label>
        <input 
          type="text" 
          placeholder="Nhập Email" 
          id="email" 
          v-model="email" 
          required
        >

        <!-- Ô nhập số điện thoại mới thêm -->
        <label for="phone"><b>Số Điện Thoại</b></label>
        <input 
          type="tel" 
          placeholder="Nhập Số Điện Thoại" 
          id="phone" 
          v-model="phone" 
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

        <label for="psw-repeat"><b>Lặp Lại Mật Khẩu</b></label>
        <input 
          type="password" 
          placeholder="Lặp Lại Mật Khẩu" 
          id="psw-repeat" 
          v-model="passwordRepeat" 
          required
        >
        <hr>

        <p>Bằng cách tạo một tài khoản, bạn đồng ý với <a href="#">Điều khoản & Quyền riêng tư</a> của chúng tôi.</p>
        <button type="submit" class="registerbtn">Đăng Ký</button>
      </div>

      <div class="container signin">
        <p>Bạn đã có sẵn tài khoản? <a title="Đăng Nhập" href="./dangnhap.html">Đăng Nhập</a>.</p>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Scoped giúp bao bọc toàn bộ CSS này riêng cho trang đăng ký */
.register-wrapper {
  font-family: Arial, Helvetica, sans-serif;
  background-color: #000;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0;
}

.register-form {
  width: 100%;
  max-width: 700px; /* Sửa lại chiều rộng này cho responsive thay vì cứng 1500px dễ bị tràn màn hình */
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

/* Add padding to containers */
.container {
  padding: 30px;
  background-color: white;
}

/* Full-width input fields - đã bổ sung input[type=tel] để nhận style đồng bộ */
input[type=text], input[type=password], input[type=tel] {
  width: 100%;
  padding: 15px;
  margin: 8px 0 22px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f1f1f1;
  box-sizing: border-box;
}

input[type=text]:focus, input[type=password]:focus, input[type=tel]:focus {
  background-color: #ddd;
  outline: none;
}

/* Overwrite default styles of hr */
hr {
  border: 1px solid #f1f1f1;
  margin-bottom: 25px;
}

/* Set a style for the submit button */
.registerbtn {
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

.registerbtn:hover {
  opacity: 1;
}

/* Add a blue text color to links */
a {
  color: dodgerblue;
}

/* Set a grey background color and center the text of the "sign in" section */
.signin {
  background-color: #f1f1f1;
  text-align: center;
  border-top: 1px solid #e1e1e1;
}

/* Hộp thông báo trạng thái đẹp mắt */
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