<script setup>
import { ref, computed } from "vue";

// ========================================================
// 1. DỮ LIỆU GIẢ LẬP KHỚP 100% BẢNG VOUCHERS MỚI
// ========================================================
const vouchers = ref([
  {
    voucher_id: 1,
    voucher_code: "WELCOME26",
    discount_amount: 50000,
    min_order_value: 200000,
    start_date: "2026-01-01T00:00",
    expiry_date: "2026-12-31T23:59",
    usage_limit: 1000,
    used_count: 850,
    is_active: true,
  },
  {
    voucher_id: 2,
    voucher_code: "FREESHIP",
    discount_amount: 30000,
    min_order_value: 150000,
    start_date: "2026-05-01T00:00",
    expiry_date: "2026-06-30T23:59",
    usage_limit: 500,
    used_count: 500,
    is_active: true,
  },
  {
    voucher_id: 3,
    voucher_code: "TETNGUYENDAN",
    discount_amount: 200000,
    min_order_value: 1500000,
    start_date: "2027-01-15T00:00",
    expiry_date: "2027-02-15T23:59",
    usage_limit: 50,
    used_count: 0,
    is_active: true, // Mã lên lịch trước
  },
  {
    voucher_id: 4,
    voucher_code: "KITCHEFVIP",
    discount_amount: 500000,
    min_order_value: 3000000,
    start_date: "2026-01-01T00:00",
    expiry_date: "2026-11-20T23:59",
    usage_limit: 100,
    used_count: 45,
    is_active: true,
  },
]);

// ========================================================
// 2. BỘ LỌC VÀ TÌM KIẾM ĐỘNG
// ========================================================
const searchQuery = ref("");
const selectedStatus = ref("all");

const filteredVouchers = computed(() => {
  return vouchers.value.filter((v) => {
    const matchSearch = v.voucher_code
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());

    let matchStatus = true;
    if (selectedStatus.value === "active") matchStatus = v.is_active === true;
    if (selectedStatus.value === "inactive")
      matchStatus = v.is_active === false;

    return matchSearch && matchStatus;
  });
});

const formatPrice = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const formatDateDisplay = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Kiểm tra trạng thái thời gian thực
const isExpired = (expiryDate) => new Date(expiryDate) < new Date();
const isUpcoming = (startDate) => new Date(startDate) > new Date();
const isOutOfStock = (used, limit) => used >= limit;

// Phần trăm sử dụng mã
const getUsagePercent = (used, limit) => {
  if (limit === 0) return 0;
  return Math.min(Math.round((used / limit) * 100), 100);
};

// ========================================================
// 3. LOGIC XỬ LÝ FORM MODAL (CRUD)
// ========================================================
const isModalOpen = ref(false);
const modalMode = ref("add");

const voucherForm = ref({
  voucher_id: null,
  voucher_code: "",
  discount_amount: 0,
  min_order_value: 0,
  start_date: "",
  expiry_date: "",
  usage_limit: 100,
  used_count: 0,
  is_active: true,
});

const openAddModal = () => {
  modalMode.value = "add";

  // Mặc định Start Date là ngày giờ hiện tại
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localISOTime = new Date(now - offset).toISOString().slice(0, 16);

  voucherForm.value = {
    voucher_id: null,
    voucher_code: "",
    discount_amount: 0,
    min_order_value: 0,
    start_date: localISOTime,
    expiry_date: "",
    usage_limit: 100,
    used_count: 0,
    is_active: true,
  };
  isModalOpen.value = true;
};

const openEditModal = (voucher) => {
  modalMode.value = "edit";
  voucherForm.value = { ...voucher };
  isModalOpen.value = true;
};

const deleteVoucher = (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa mã giảm giá này vĩnh viễn?")) {
    vouchers.value = vouchers.value.filter((v) => v.voucher_id !== id);
  }
};

const saveVoucher = () => {
  // Chuẩn hóa Voucher Code: Tự động chuyển thành chữ HOA và xóa khoảng trắng
  voucherForm.value.voucher_code = voucherForm.value.voucher_code
    .toUpperCase()
    .replace(/\s/g, "");

  if (modalMode.value === "add") {
    const newId =
      vouchers.value.length > 0
        ? Math.max(...vouchers.value.map((v) => v.voucher_id)) + 1
        : 1;
    vouchers.value.unshift({
      ...voucherForm.value,
      voucher_id: newId,
    });
  } else {
    const index = vouchers.value.findIndex(
      (v) => v.voucher_id === voucherForm.value.voucher_id,
    );
    if (index !== -1) {
      vouchers.value[index] = { ...voucherForm.value };
    }
  }
  isModalOpen.value = false;
};
</script>

<template>
  <div class="vouchers-tab-wrapper">
    <div class="admin-card animate-fade">
      <div class="table-control-bar">
        <div class="control-left">
          <div class="admin-search-box">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Nhập mã CODE giảm giá..."
              class="input-admin-search"
            />
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <select v-model="selectedStatus" class="select-admin-filter">
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang kích hoạt</option>
            <option value="inactive">Đã khóa</option>
          </select>
        </div>
        <button class="btn-create-item" @click="openAddModal">
          <i class="fa-solid fa-ticket"></i> Tạo mã Voucher mới
        </button>
      </div>

      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã Giảm Giá (Code)</th>
              <th>Mức giảm / Đơn tối thiểu</th>
              <th>Thời gian áp dụng</th>
              <th>Đã dùng / Tổng</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in filteredVouchers" :key="v.voucher_id">
              <td>
                <strong>#{{ v.voucher_id }}</strong>
              </td>
              <td>
                <span class="badge-voucher-code"
                  ><i class="fa-solid fa-tag"></i> {{ v.voucher_code }}</span
                >
              </td>
              <td>
                <div class="discount-info-cell">
                  <span class="discount-amt"
                    >-{{ formatPrice(v.discount_amount) }}</span
                  >
                  <span class="min-order-amt"
                    >Đơn từ: {{ formatPrice(v.min_order_value) }}</span
                  >
                </div>
              </td>
              <td>
                <div class="time-cell">
                  <span class="date-text"
                    >Từ: {{ formatDateDisplay(v.start_date) }}</span
                  >
                  <span
                    :class="[
                      'date-text',
                      { 'expired-text': isExpired(v.expiry_date) },
                    ]"
                  >
                    Đến: {{ formatDateDisplay(v.expiry_date) }}
                  </span>
                  <div class="time-tags">
                    <span v-if="isExpired(v.expiry_date)" class="tag-expired"
                      >Đã hết hạn</span
                    >
                    <span
                      v-else-if="isUpcoming(v.start_date)"
                      class="tag-upcoming"
                      >Sắp diễn ra</span
                    >
                    <span v-else class="tag-running">Đang chạy</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="usage-progress-box">
                  <div class="usage-text">
                    <span class="used-val">{{ v.used_count }}</span> /
                    <span class="limit-val">{{ v.usage_limit }}</span>
                  </div>
                  <div class="progress-bar-bg">
                    <div
                      class="progress-bar-fill"
                      :class="{
                        'is-full': isOutOfStock(v.used_count, v.usage_limit),
                      }"
                      :style="{
                        width:
                          getUsagePercent(v.used_count, v.usage_limit) + '%',
                      }"
                    ></div>
                  </div>
                  <span
                    v-if="isOutOfStock(v.used_count, v.usage_limit)"
                    class="out-of-stock-text"
                    >Hết mã!</span
                  >
                </div>
              </td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    v.is_active ? 'active-status' : 'disabled-status',
                  ]"
                >
                  {{ v.is_active ? "Đang mở" : "Đã khóa" }}
                </span>
              </td>
              <td>
                <div class="table-actions">
                  <button
                    class="btn-action-edit"
                    title="Chỉnh sửa"
                    @click="openEditModal(v)"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    class="btn-action-delete"
                    title="Xóa bỏ"
                    @click="deleteVoucher(v.voucher_id)"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredVouchers.length === 0">
              <td colspan="7" class="text-center-empty">
                Không tìm thấy mã giảm giá nào!
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
                ? "Tạo Mã Giảm Giá Mới"
                : "Cập Nhật Mã Giảm Giá"
            }}
          </h3>
          <button class="btn-close-modal" @click="isModalOpen = false">
            &times;
          </button>
        </div>
        <form @submit.prevent="saveVoucher" class="modal-form-body">
          <div class="form-group">
            <label>Mã Giảm Giá (Code) <span class="required">*</span></label>
            <input
              type="text"
              v-model="voucherForm.voucher_code"
              required
              placeholder="VD: KHUYENMAI2026 (Chỉ ghi hoa, không dấu cách)"
              style="text-transform: uppercase"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Số tiền giảm (VND) <span class="required">*</span></label>
              <input
                type="number"
                v-model.number="voucherForm.discount_amount"
                min="0"
                required
                placeholder="VD: 50000"
              />
            </div>
            <div class="form-group">
              <label>Đơn tối thiểu (VND) <span class="required">*</span></label>
              <input
                type="number"
                v-model.number="voucherForm.min_order_value"
                min="0"
                required
                placeholder="VD: 200000"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label
                >Từ ngày (Start Date) <span class="required">*</span></label
              >
              <input
                type="datetime-local"
                v-model="voucherForm.start_date"
                required
              />
            </div>
            <div class="form-group">
              <label
                >Đến ngày (Expiry Date) <span class="required">*</span></label
              >
              <input
                type="datetime-local"
                v-model="voucherForm.expiry_date"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label
                >Tổng giới hạn lượt dùng <span class="required">*</span></label
              >
              <input
                type="number"
                v-model.number="voucherForm.usage_limit"
                min="1"
                required
              />
            </div>
            <div class="form-group" v-if="modalMode === 'edit'">
              <label>Số lượt đã sử dụng (Chỉ xem)</label>
              <input
                type="number"
                v-model.number="voucherForm.used_count"
                readonly
                style="background-color: #f1f1f1"
              />
            </div>
          </div>

          <div class="form-group checkbox-group">
            <input
              type="checkbox"
              id="modal-active-chk"
              v-model="voucherForm.is_active"
            />
            <label for="modal-active-chk"
              >Kích hoạt mở mã giảm giá ngay lập tức</label
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
/* ========================================================
   CSS ĐỒNG BỘ LAYOUT ADMIN CỐT LÕI
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
  vertical-align: top;
}

/* Code Voucher */
.badge-voucher-code {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #f4fbf6;
  color: #2c3e50;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 800;
  border: 2px dashed #4caf50;
  letter-spacing: 1px;
}
.badge-voucher-code i {
  color: #4caf50;
}

.discount-info-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.discount-amt {
  font-weight: 800;
  color: #ff3b30;
  font-size: 1.05rem;
}
.min-order-amt {
  font-size: 0.8rem;
  color: #888;
  font-weight: 600;
}

/* Ô thời gian áp dụng */
.time-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.date-text {
  font-size: 0.85rem;
  color: #4a554f;
  font-weight: 600;
}
.expired-text {
  color: #aaa;
  text-decoration: line-through;
}
.time-tags {
  margin-top: 5px;
}
.tag-expired {
  background-color: #f1f1f1;
  color: #888;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  display: inline-block;
}
.tag-upcoming {
  background-color: #e8f0fe;
  color: #1a73e8;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  display: inline-block;
}
.tag-running {
  background-color: #fff4e5;
  color: #ff9800;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  display: inline-block;
}

/* Thanh tiến độ sử dụng */
.usage-progress-box {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 120px;
}
.usage-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
  display: flex;
  justify-content: space-between;
}
.used-val {
  color: #1a251e;
  font-weight: 800;
}
.progress-bar-bg {
  width: 100%;
  height: 8px;
  background-color: #e1ebe3;
  border-radius: 10px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}
.progress-bar-fill.is-full {
  background-color: #ff3b30;
}
.out-of-stock-text {
  font-size: 0.75rem;
  color: #ff3b30;
  font-weight: 700;
  text-align: right;
}

/* Trạng thái */
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
</style>
