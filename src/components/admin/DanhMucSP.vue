<script setup>
import { ref, computed } from "vue";

// 1. BIẾN KIỂM SOÁT SUB-TAB NỘI BỘ (Sản phẩm hoặc Danh mục)
const subTab = ref("productList");

// ========================================================
// DỮ LIỆU GIẢ LẬP KHỚP 100% VỚI CẤU TRÚC DATABASE KITCHEF
// ========================================================

// Mảng danh mục (Khớp với dữ liệu khởi tạo dữ liệu phẳng trong SQL)
const categories = ref([
  {
    category_id: 1,
    category_name: "Nồi, Chảo",
    description: "Các loại nồi inox, chảo chống dính, chảo gang",
  },
  {
    category_id: 2,
    category_name: "Dao, Kéo",
    description: "Dao thái, dao gọt, kéo cắt thực phẩm",
  },
  {
    category_id: 3,
    category_name: "Tô, Chén, Dĩa",
    description: "Bát đĩa sứ, thủy tinh, dụng cụ bàn ăn",
  },
  {
    category_id: 4,
    category_name: "Phụ kiện bếp",
    description: "Vá, muôi, sạn, phới lồng, thớt",
  },
  {
    category_id: 5,
    category_name: "Khác",
    description: "Các dụng cụ nhà bếp khác",
  },
]);

// Mảng sản phẩm
const products = ref([
  {
    product_id: 1,
    category_id: 1,
    product_name: "Nồi Gang Tráng Men KitChef Đỏ Cherry 24cm",
    price: 2450000,
    stock_quantity: 15,
    is_active: true,
    image_url:
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=100&q=80",
  },
  {
    product_id: 2,
    category_id: 1,
    product_name: "Chảo Chống Dính Vân Đá Cao Cấp Tefal 28cm",
    price: 890000,
    stock_quantity: 42,
    is_active: true,
    image_url:
      "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=100&q=80",
  },
  {
    product_id: 3,
    category_id: 2,
    product_name: "Bộ Dao Nhà Bếp Damascus Nhật Bản 3 Món",
    price: 3200000,
    stock_quantity: 8,
    is_active: true,
    image_url:
      "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=100&q=80",
  },
  {
    product_id: 4,
    category_id: 3,
    product_name: "Bộ Bát Đĩa Sứ Viền Vàng (Set 16 món)",
    price: 1100000,
    stock_quantity: 20,
    is_active: true,
    image_url:
      "https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=100&q=80",
  },
  {
    product_id: 5,
    category_id: 1,
    product_name: "Nồi Chiên Không Dầu Điện Tử Philips 4.5L",
    price: 2150000,
    stock_quantity: 11,
    is_active: true,
    image_url:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=100&q=80",
  },
  {
    product_id: 6,
    category_id: 4,
    product_name: "Kệ Gia Vị Inox 304 Xoay 360 Độ",
    price: 450000,
    stock_quantity: 50,
    is_active: true,
    image_url:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=100&q=80",
  },
]);

// ========================================================
// BỘ LỌC VÀ TÌM KIẾM SẢN PHẨM ĐỘNG (DỌN SẠCH LỖI BIẾN)
// ========================================================
const searchQuery = ref("");
const adminSelectedCategory = ref("all");

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchSearch = p.product_name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchCat =
      adminSelectedCategory.value === "all" ||
      p.category_id === Number(adminSelectedCategory.value);
    return matchSearch && matchCat;
  });
});

// Hàm lấy nhanh tên danh mục dựa vào ID để render lên bảng
const getCategoryName = (catId) => {
  const cat = categories.value.find((c) => c.category_id === catId);
  return cat ? cat.category_name : "Chưa phân loại";
};

// Định dạng tiền tệ VND
const formatPrice = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

// ========================================================
// LOGIC XỬ LÝ FORM MODAL (CRUD TRÊN MẢNG)
// ========================================================
const isModalOpen = ref(false);
const modalMode = ref("add"); // 'add' hoặc 'edit'

// Form Object đồng bộ với các trường trong database
const productForm = ref({
  product_id: null,
  product_name: "",
  category_id: "",
  price: 0,
  stock_quantity: 0,
  description: "",
  image_url: "",
  is_active: true,
});

// Mở form thêm mới
const openAddModal = () => {
  modalMode.value = "add";
  productForm.value = {
    product_id: null,
    product_name: "",
    category_id: "",
    price: 0,
    stock_quantity: 0,
    description: "",
    image_url: "",
    is_active: true,
  };
  isModalOpen.value = true;
};

// Mở form chỉnh sửa dữ liệu có sẵn
const openEditModal = (product) => {
  modalMode.value = "edit";
  productForm.value = { ...product };
  isModalOpen.value = true;
};

// Xóa sản phẩm
const deleteProduct = (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống?")) {
    products.value = products.value.filter((p) => p.product_id !== id);
  }
};

// Submit Form (Lưu / Cập nhật dữ liệu)
const saveProduct = () => {
  if (modalMode.value === "add") {
    // Giả lập cơ chế khóa chính Identity(1,1) tự tăng của SQL Server
    const newId =
      products.value.length > 0
        ? Math.max(...products.value.map((p) => p.product_id)) + 1
        : 1;
    products.value.push({
      ...productForm.value,
      product_id: newId,
      category_id: Number(productForm.value.category_id),
    });
  } else {
    // Chế độ chỉnh sửa cập nhật thông tin sản phẩm
    const index = products.value.findIndex(
      (p) => p.product_id === productForm.value.product_id,
    );
    if (index !== -1) {
      products.value[index] = {
        ...productForm.value,
        category_id: Number(productForm.value.category_id),
      };
    }
  }
  isModalOpen.value = false;
};
</script>

<template>
  <div class="products-tab-wrapper">
    <div class="admin-sub-tabs">
      <button
        :class="{ active: subTab === 'productList' }"
        @click="subTab = 'productList'"
      >
        <i class="fa-solid fa-utensils"></i> Danh sách Sản phẩm
      </button>
      <button
        :class="{ active: subTab === 'categoryList' }"
        @click="subTab = 'categoryList'"
      >
        <i class="fa-solid fa-folder"></i> Danh mục sản phẩm (Phẳng)
      </button>
    </div>

    <div v-if="subTab === 'productList'" class="admin-card animate-fade">
      <div class="table-control-bar">
        <div class="control-left">
          <div class="admin-search-box">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Tìm kiếm tên dụng cụ..."
              class="input-admin-search"
            />
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <select v-model="adminSelectedCategory" class="select-admin-filter">
            <option value="all">Tất cả danh mục</option>
            <option
              v-for="cat in categories"
              :key="cat.category_id"
              :value="cat.category_id"
            >
              {{ cat.category_name }}
            </option>
          </select>
        </div>
        <button class="btn-create-item" @click="openAddModal">
          <i class="fa-solid fa-plus"></i> Thêm sản phẩm mới
        </button>
      </div>

      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá bán</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prod in filteredProducts" :key="prod.product_id">
              <td>
                <strong>#{{ prod.product_id }}</strong>
              </td>
              <td>
                <img
                  :src="prod.image_url"
                  class="table-product-thumb"
                  alt="thumb"
                />
              </td>
              <td>
                <span class="table-product-name" :title="prod.product_name">{{
                  prod.product_name
                }}</span>
              </td>
              <td>
                <span class="badge-cat-label">{{
                  getCategoryName(prod.category_id)
                }}</span>
              </td>
              <td>
                <span class="table-price">{{ formatPrice(prod.price) }}</span>
              </td>
              <td>
                <span
                  :class="[
                    'stock-indicator',
                    prod.stock_quantity < 10 ? 'low-stock' : 'good-stock',
                  ]"
                >
                  {{ prod.stock_quantity }} cái
                </span>
              </td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    prod.is_active ? 'active-status' : 'disabled-status',
                  ]"
                >
                  {{ prod.is_active ? "Đang bán" : "Ẩn" }}
                </span>
              </td>
              <td>
                <div class="table-actions">
                  <button
                    class="btn-action-edit"
                    title="Chỉnh sửa"
                    @click="openEditModal(prod)"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    class="btn-action-delete"
                    title="Xóa bỏ"
                    @click="deleteProduct(prod.product_id)"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="8" class="text-center-empty">
                Không tìm thấy sản phẩm nào phù hợp bộ lọc!
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="subTab === 'categoryList'" class="admin-card animate-fade">
      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID Danh mục</th>
              <th>Tên nhóm danh mục</th>
              <th>Mô tả chi tiết nhóm hàng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in categories" :key="cat.category_id">
              <td>
                <strong>#{{ cat.category_id }}</strong>
              </td>
              <td>
                <span class="category-name-bold">{{ cat.category_name }}</span>
              </td>
              <td>
                <span class="category-desc-text">{{ cat.description }}</span>
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
              modalMode === "add"
                ? "Thêm Dụng Cụ Mới"
                : "Cập Nhật Thông Tin Dụng Cụ"
            }}
          </h3>
          <button class="btn-close-modal" @click="isModalOpen = false">
            &times;
          </button>
        </div>
        <form @submit.prevent="saveProduct" class="modal-form-body">
          <div class="form-row">
            <div class="form-group">
              <label>Tên sản phẩm <span class="required">*</span></label>
              <input
                type="text"
                v-model="productForm.product_name"
                required
                placeholder="Ví dụ: Chảo gang đúc..."
              />
            </div>
            <div class="form-group">
              <label>Danh mục bếp <span class="required">*</span></label>
              <select v-model="productForm.category_id" required>
                <option value="" disabled>-- Chọn danh mục --</option>
                <option
                  v-for="cat in categories"
                  :key="cat.category_id"
                  :value="cat.category_id"
                >
                  {{ cat.category_name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Giá bán lẻ (VND) <span class="required">*</span></label>
              <input
                type="number"
                v-model.number="productForm.price"
                min="0"
                required
              />
            </div>
            <div class="form-group">
              <label>Số lượng ban đầu <span class="required">*</span></label>
              <input
                type="number"
                v-model.number="productForm.stock_quantity"
                min="0"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label>Link ảnh sản phẩm (Image URL)</label>
            <input
              type="text"
              v-model="productForm.image_url"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div class="form-group">
            <label>Mô tả chi tiết sản phẩm</label>
            <textarea
              v-model="productForm.description"
              rows="4"
              placeholder="Nhập công dụng, thông số kỹ thuật..."
            ></textarea>
          </div>

          <div class="form-group checkbox-group">
            <input
              type="checkbox"
              id="modal-active-chk"
              v-model="productForm.is_active"
            />
            <label for="modal-active-chk"
              >Kích hoạt mở bán ngay trên Website</label
            >
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
  </div>
</template>

<style scoped>
/* SUB TABS NỘI BỘ */
.admin-sub-tabs {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  border-bottom: 1px solid #cedbd0;
  padding-bottom: 10px;
}
.admin-sub-tabs button {
  background: none;
  border: none;
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s;
}
.admin-sub-tabs button.active {
  color: #4caf50;
  font-weight: 700;
}
.admin-sub-tabs button.active::after {
  content: "";
  position: absolute;
  bottom: -12px;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #4caf50;
  border-radius: 2px;
}

/* CARD KHUNG CHỨA */
.admin-card {
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #eef3ef;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
}

/* CONTROL BAR TRÊN BẢNG */
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

/* TABLE THIẾT KẾ */
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
.table-product-thumb {
  width: 45px;
  height: 45px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e1ebe3;
}
.table-product-name {
  font-weight: 700;
  color: #2c3e50;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-width: 250px;
}
.badge-cat-label {
  background-color: #f4fbf6;
  color: #4caf50;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 700;
  border: 1px solid #e1ebe3;
}
.table-price {
  font-weight: 750;
  color: #ff3b30;
}
.stock-indicator {
  font-weight: 600;
  font-size: 0.85rem;
}
.low-stock {
  color: #ff9500;
}
.good-stock {
  color: #4caf50;
}
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
.category-name-bold {
  font-weight: 700;
  color: #1a251e;
}
.category-desc-text {
  color: #666;
  font-size: 0.85rem;
}
.text-center-empty {
  text-align: center;
  padding: 40px 0 !important;
  color: #888;
  font-weight: 600;
}

/* MODAL STYLES */
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
.form-group input[type="text"],
.form-group input[type="number"],
.form-group select,
.form-group textarea {
  padding: 11px 15px;
  border: 1px solid #cedbd0;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  font-family: inherit;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.15);
}
.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
}
.checkbox-group input {
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
