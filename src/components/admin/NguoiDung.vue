<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const users = ref([]);
const roles = ref([]); // Lấy danh sách Role từ API hoặc định nghĩa cứng nếu ít đổi

const fetchUsers = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/users/all");
    users.value = res.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách user:", error);
  }
};

onMounted(async () => {
  await fetchUsers();
  try {
    const res = await axios.get("http://localhost:8080/api/roles");
    roles.value = res.data;
  } catch (err) {
    console.error("Không lấy được danh sách quyền!");
  }
});

// Hàm lưu (Thêm hoặc Sửa)
const saveUser = async () => {
  try {
    const payload = {
      fullName: userForm.value.full_name,
      email: userForm.value.email,
      phoneNumber: userForm.value.phone_number,
      isActive: Boolean(userForm.value.isActive), // Đảm bảo là Boolean (true/false)
      address: userForm.value.address,
      password: userForm.value.password 
    };

    if (modalMode.value === "add") {
// 1. Tạo User
      const res = await axios.post("http://localhost:8080/api/users/add", payload);
      
      // 2. Lấy ID của user vừa tạo (giả sử API trả về user object hoặc bạn fetch lại)
      // Cách đơn giản: fetchUsers() trước để lấy danh sách mới nhất, sau đó tìm ID user vừa tạo theo email
      await fetchUsers();
      const newUser = users.value.find(u => u.email === userForm.value.email);
      
      // 3. Gán quyền đã chọn trong combobox
      if (newUser && userForm.value.roleName) {
         await axios.put(`http://localhost:8080/api/users/${newUser.userId}/assign-role?roleName=${userForm.value.roleName}`);
      }
      alert("Thêm và phân quyền thành công!");
    } else {
      // CẬP NHẬT: Phải có userId
      if (!userForm.value.userId) {
         alert("Lỗi: Không xác định được ID người dùng!");
         return;
      }
      await axios.put(`http://localhost:8080/api/users/${userForm.value.userId}`, payload);
      
      // Chỉ cập nhật quyền khi đang chỉnh sửa
      if (userForm.value.roleName) {
        await axios.put(`http://localhost:8080/api/users/${userForm.value.userId}/assign-role?roleName=${userForm.value.roleName}`);
      }
      alert("Cập nhật thành công!");
    }
    
await fetchUsers();
    isModalOpen.value = false;
  } catch (error) {
    console.error("Lỗi:", error);
    alert("Có lỗi xảy ra, vui lòng kiểm tra lại dữ liệu!");
  }
};

// Hàm xóa
const deleteUser = async (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa?")) {
    await axios.delete(`http://localhost:8080/api/users/${id}`);
    await fetchUsers();
  }
};

// hàm chi tiết
const isDetailModalOpen = ref(false);
const selectedUserDetail = ref(null);

const openDetailModal = (user) => {
  selectedUserDetail.value = user; // Lưu user để hiển thị trong Modal
  isDetailModalOpen.value = true;
};
// ========================================================
// 2. BỘ LỌC VÀ TÌM KIẾM ĐỘNG
// ========================================================
const searchQuery = ref("");
const selectedRole = ref("all");

const filteredUsers = computed(() => {
  // Thêm kiểm tra users.value có dữ liệu hay không
  if (!users.value || users.value.length === 0) return [];

  return users.value.filter((u) => {
    // Đảm bảo u.fullName và u.email tồn tại trước khi gọi toLowerCase
    const name = (u.fullName || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    const query = searchQuery.value.toLowerCase();

    const matchSearch = name.includes(query) || email.includes(query);
    // Sửa logic lọc trong filteredUsers
const matchRole =
  selectedRole.value === "all" ||
  (u.roles && u.roles.includes(selectedRole.value)); // Kiểm tra quyền duy nhất

    return matchSearch && matchRole;
  });
});

const getRoleName = (rolesArray) => {
  // Vì chỉ có 1 quyền, trả về phần tử đầu tiên
  if (!rolesArray || rolesArray.length === 0) return "KHÔNG CÓ QUYỀN";
  return rolesArray[0]; // Trả về chuỗi duy nhất, ví dụ: "ROLE_ADMIN"
};

// ========================================================
// 3. LOGIC XỬ LÝ FORM MODAL (CRUD)
// ========================================================
const isModalOpen = ref(false);
const modalMode = ref("add"); // 'add' hoặc 'edit'

const userForm = ref({
  userId: null,
  role_id: 3, // Mặc định tạo tài khoản là CUSTOMER
  full_name: "",
  email: "",
  phone_number: "",
  address: "",
  password: "", // Password thật để gửi xuống DB băm thành password_hash
  isActive: true,
});

// Mở form thêm mới
const openAddModal = () => {
  modalMode.value = "add";
  userForm.value = {
    userId: null,
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    password: "",
    isActive: true,
    roleName: "ROLE_USER" // Giá trị mặc định
  };
  isModalOpen.value = true;
};

// Mở form chỉnh sửa (Không load password lên để bảo mật)
const openEditModal = (user) => {
  console.log("Dữ liệu user nhận được:", user);
  modalMode.value = "edit";
  const addr = (user.addresses && user.addresses.length > 0) ? user.addresses[0].addressLine : "";

  // Trích xuất quyền từ Set<String> roles của User
  const currentRole = (user.roles && user.roles.length > 0) ? user.roles[0] : "";

  userForm.value = {
    userId: user.userId,
    full_name: user.fullName,
    email: user.email,
    phone_number: user.phoneNumber,
    address: addr,
    roleName: currentRole, // Gán quyền hiện tại vào đây
    isActive: user.isActive
  };
  isModalOpen.value = true;
};
</script>

<template>
  <div class="users-tab-wrapper">
    <div class="admin-card animate-fade">
      <div class="table-control-bar">
        <div class="control-left">
          <div class="admin-search-box">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Tìm kiếm tên, email..."
              class="input-admin-search"
            />
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <select v-model="selectedRole" class="select-admin-filter">
            <option value="all">Tất cả vai trò</option>
            <option
              v-for="role in roles"
              :key="role.role_id"
              :value="role.role_id"
            >
              {{ role.role_name }}
            </option>
          </select>
        </div>
        <button class="btn-create-item" @click="openAddModal">
          <i class="fa-solid fa-user-plus"></i> Thêm tài khoản
        </button>
      </div>

      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ và Tên</th>
              <th>Liên hệ</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.userId">
              <td>
                <strong>#{{ user.userId }}</strong>
              </td>
              <td>
                <div class="user-name-cell">
                  <div class="avatar-sm">
                    {{ user.fullName.charAt(0).toUpperCase() }}
                  </div>
                  <span class="table-product-name">{{ user.fullName }}</span>
                </div>
              </td>
              <td>
                <div class="contact-cell">
                  <span class="contact-email"
                    ><i class="fa-regular fa-envelope"></i>
                    {{ user.email }}</span
                  >
                  <span class="contact-phone"
                    ><i class="fa-solid fa-phone"></i>
                    {{ user.phoneNumber }}</span
                  >
                </div>
              </td>
              <td>
                <span
                  :class="[
                    'badge-role',
                    'role-' +
                      (user.roles && user.roles.length > 0
                        ? user.roles[0].toLowerCase()
                        : 'none'),
                  ]"
                >
                  {{ getRoleName(user.roles) }}
                </span>
              </td>
<td>
  <span :class="['status-badge', user.isActive ? 'active-status' : 'disabled-status']">
    {{ user.isActive ? "Hoạt động" : "Đã khóa" }}
  </span>
</td>
              <td>
                <div class="table-actions">
                  <button
                    class="btn-action-view"
                    title="Xem chi tiết"
                    @click="openDetailModal(user)"
                  >
                    <i class="fa-solid fa-eye"></i>
                  </button>
                  <button
                    class="btn-action-edit"
                    title="Chỉnh sửa"
                    @click="openEditModal(user)"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    class="btn-action-delete"
                    title="Xóa bỏ"
                    @click="deleteUser(user.userId)"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="text-center-empty">
                Không tìm thấy tài khoản nào!
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div :class="['admin-modal-overlay', { show: isModalOpen }]">
      <div class="admin-modal-box">
        <div class="modal-header">
          <h3>
            {{
              modalMode === "add" ? "Tạo Tài Khoản Mới" : "Cập Nhật Tài Khoản"
            }}
          </h3>
          <button class="btn-close-modal" @click="isModalOpen = false">
            &times;
          </button>
        </div>
        <form @submit.prevent="saveUser" class="modal-form-body">
          <div class="form-row">
            <div class="form-group">
              <label>Họ và Tên <span class="required">*</span></label>
              <input
                type="text"
                v-model="userForm.full_name"
                required
                placeholder="Nhập họ tên..."
              />
            </div>
            <div class="form-group">
              <label>Phân quyền (Role) <span class="required">*</span></label>
              <select v-model="userForm.roleName" required>
                <option value="" disabled>-- Chọn quyền --</option>
                <option
                  v-for="role in roles"
                  :key="role.roleId"
                  :value="role.roleName"
                >
                  {{ role.roleName }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Email <span class="required">*</span></label>
              <input
                type="email"
                v-model="userForm.email"
                required
                placeholder="example@gmail.com"
              />
            </div>
            <div class="form-group">
              <label>Số điện thoại <span class="required">*</span></label>
              <input
                type="tel"
                v-model="userForm.phone_number"
                required
                placeholder="09xxxxxxx"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Địa chỉ</label>
            <input
              type="text"
              v-model="userForm.address"
              placeholder="Nhập địa chỉ nhận hàng/làm việc..."
            />
          </div>

          <div class="form-group">
            <label
              >Mật khẩu
              <span v-if="modalMode === 'add'" class="required">*</span></label
            >
            <input
              type="password"
              v-model="userForm.password"
              :required="modalMode === 'add'"
              :placeholder="
                modalMode === 'edit'
                  ? 'Để trống nếu không muốn đổi mật khẩu'
                  : 'Nhập mật khẩu'
              "
            />
          </div>

<div class="form-group">
  <label>Trạng thái tài khoản <span class="required">*</span></label>
  <select v-model="userForm.isActive" class="form-control" required>
    <option :value="true">Hoạt động</option>
    <option :value="false">Đã khóa</option>
  </select>
</div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn-modal-cancel"
              @click="isModalOpen = false"
            >
              Hủy bỏ
            </button>
            <button type="submit" class="btn-modal-submit">Lưu dữ liệu</button>
          </div>
        </form>
      </div>
    </div>

    <div class="admin-modal-overlay" :class="{ show: isDetailModalOpen }">
      <div class="admin-modal-box" v-if="selectedUserDetail">
        <div class="modal-header">
          <h3>Thông tin chi tiết #{{ selectedUserDetail.userId }}</h3>
          <button class="btn-close-modal" @click="isDetailModalOpen = false">
            &times;
          </button>
        </div>
        <div class="modal-form-body">
          <div class="detail-grid">
            <p><strong>Họ tên:</strong> {{ selectedUserDetail.fullName }}</p>
            <p><strong>Mật khẩu:</strong> {{ selectedUserDetail.password }}</p>
            <p><strong>Email:</strong> {{ selectedUserDetail.email }}</p>
            <p><strong>Số ĐT:</strong> {{ selectedUserDetail.phoneNumber }}</p>
            <p>
              <strong>Vai trò:</strong>
              {{ selectedUserDetail.roles.join(", ") }}
            </p>
            <p>
              <strong>Địa chỉ:</strong>
              {{
                selectedUserDetail.addresses &&
                selectedUserDetail.addresses.length > 0
                  ? selectedUserDetail.addresses[0].addressLine
                  : "Chưa cập nhật"
              }}
            </p>
            <p>
              <strong>Trạng thái:</strong>
              {{ selectedUserDetail.isActive ? "Hoạt động" : "Đã khóa" }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========================================================
   CSS ĐỒNG BỘ VỚI PHẦN SẢN PHẨM TRƯỚC ĐÓ
   ======================================================== */
.admin-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #eef3ef;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
}
.table-control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 20px;
}
.control-left {
  display: flex;
  gap: 15px;
  flex: 1;
  max-width: 600px;
}
.admin-search-box {
  position: relative;
  flex: 1;
}
.input-admin-search {
  width: 100%;
  padding: 10px 15px 10px 40px;
  background-color: #f9fbf9;
  border: 1px solid #cedbd0;
  border-radius: 6px;
  font-size: 0.9rem;
  box-sizing: border-box;
}
.admin-search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}
.select-admin-filter {
  padding: 10px 15px;
  background-color: #f9fbf9;
  border: 1px solid #cedbd0;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4a554f;
  cursor: pointer;
}
.btn-create-item {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
  font-size: 0.9rem;
}
.btn-create-item:hover {
  background-color: #45a049;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}
.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}
.admin-table th {
  background-color: #f8faf8;
  padding: 15px 20px;
  color: #1a251e;
  font-weight: 750;
  border-bottom: 2px solid #eef3ef;
}
.admin-table td {
  padding: 15px 20px;
  border-bottom: 1px solid #eef3ef;
  color: #4a554f;
  vertical-align: middle;
}

/* Thông tin liên hệ */
.contact-cell {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 0.85rem;
}
.contact-email,
.contact-phone {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #5c6a60;
}
.contact-email i,
.contact-phone i {
  color: #a0a0a0;
}

/* Tên và Avatar mini */
.user-name-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar-sm {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #e8f5ec;
  color: #4caf50;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
  border: 1px solid #cedbd0;
}
.table-product-name {
  font-weight: 700;
  color: #2c3e50;
}

/* Nhãn phân quyền (Role) */
.badge-role {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 700;
  border: 1px solid transparent;
}
.role-admin {
  background-color: #fbebe9;
  color: #ff3b30;
  border-color: #f5c6cb;
}
.role-staff {
  background-color: #e8f0fe;
  color: #1a73e8;
  border-color: #cce5ff;
}
.role-customer {
  background-color: #f4fbf6;
  color: #4caf50;
  border-color: #c3e6cb;
}

/* Trạng thái hoạt động */
.status-badge {
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}
.active-status {
  background-color: #e8f5ec;
  color: #4caf50;
}
.disabled-status {
  background-color: #fbebe9;
  color: #ff3b30;
}

/* Các nút hành động */
.table-actions {
  display: flex;
  gap: 10px;
}
.table-actions button {
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  transition: all 0.2s;
}
.btn-action-edit {
  background-color: #e8f5ec;
  color: #4caf50;
}
.btn-action-edit:hover {
  background-color: #4caf50;
  color: white;
}
.btn-action-delete {
  background-color: #fbebe9;
  color: #ff3b30;
}
.btn-action-delete:hover {
  background-color: #ff3b30;
  color: white;
}
.text-center-empty {
  text-align: center;
  padding: 40px 0 !important;
  color: #888;
  font-weight: 600;
}

/* MODAL STYLES CHUNG */
.admin-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}
.admin-modal-overlay.show {
  opacity: 1;
  visibility: visible;
}
.admin-modal-box {
  background-color: white;
  border-radius: 12px;
  width: 100%;
  max-width: 650px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transform: translateY(-20px);
  transition: transform 0.3s ease;
}
.admin-modal-overlay.show .admin-modal-box {
  transform: translateY(0);
}
.modal-header {
  padding: 20px 25px;
  background-color: #f8faf8;
  border-bottom: 1px solid #eef3ef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #1a251e;
}
.btn-close-modal {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #aaa;
  line-height: 1;
}
.btn-close-modal:hover {
  color: #000;
}
.modal-form-body {
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.form-row {
  display: flex;
  gap: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
.form-group label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #2c3e50;
}
.required {
  color: #ff3b30;
}
.form-group input,
.form-group select {
  padding: 11px 15px;
  border: 1px solid #cedbd0;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  font-family: inherit;
}
.form-group input:focus,
.form-group select:focus {
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.15);
}
.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
}
.checkbox-group input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #4caf50;
  cursor: pointer;
}
.checkbox-group label {
  font-weight: 600;
  cursor: pointer;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 15px;
  border-top: 1px solid #eef3ef;
  padding-top: 20px;
}
.btn-modal-cancel {
  background-color: #f5f5f5;
  border: none;
  padding: 11px 22px;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  color: #666;
}
.btn-modal-cancel:hover {
  background-color: #e5e5e5;
}
.btn-modal-submit {
  background-color: #4caf50;
  border: none;
  padding: 11px 25px;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  color: white;
}
.btn-modal-submit:hover {
  background-color: #45a049;
}

.animate-fade {
  animation: fadeIn 0.4s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .table-control-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .control-left {
    flex-direction: column;
  }
  .form-row {
    flex-direction: column;
    gap: 18px;
  }
}
</style>
