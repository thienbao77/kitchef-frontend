<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

// 1. Dữ liệu trạng thái
const orders = ref([]);
const orderStatuses = ref([]);
const searchQuery = ref("");
const selectedStatus = ref("all");

// 2. Logic Modal
const isModalOpen = ref(false);
const currentOrder = ref(null);
const currentOrderDetails = ref([]);

// 3. Hàm lấy dữ liệu
const fetchOrders = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/orders/all");
    orders.value = res.data;
  } catch (error) {
    console.error("Lỗi tải đơn hàng:", error);
  }
};

// 4. Các hàm xử lý
const getStatusName = (statusId) => {
  if (!orderStatuses.value || !Array.isArray(orderStatuses.value))
    return "Không xác định";
  const st = orderStatuses.value.find((s) => s.statusId === statusId);
  return st ? st.statusName : "Không xác định";
};

const formatDate = (dateString) => {
  const d = new Date(dateString);
  return d.toLocaleDateString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatPrice = (value) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value,
  );

const deleteOrder = async (orderId) => {
  if (confirm("Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này?")) {
    try {
      await axios.delete(`http://localhost:8080/api/orders/delete/${orderId}`);
      await fetchOrders();
      alert("Đã xóa đơn hàng!");
    } catch (error) {
      alert("Lỗi khi xóa đơn hàng!");
    }
  }
};

const openOrderDetail = (order) => {
  currentOrder.value = JSON.parse(JSON.stringify(order));
  currentOrderDetails.value = order.orderDetails ? order.orderDetails : [];
  isModalOpen.value = true;
};

const changeOrderStatus = async (newStatusId) => {
  try {
    await axios.put(
      `http://localhost:8080/api/orders/update-status/${currentOrder.value.orderId}`,
      null,
      {
        params: { statusId: newStatusId },
      },
    );
    await fetchOrders();
    isModalOpen.value = false;
  } catch (error) {
    alert("Lỗi cập nhật trạng thái!");
  }
};

const canConfirmOrder = computed(() => {
  if (!currentOrder.value) return false;
  const createdTime = new Date(currentOrder.value.createdAt).getTime();
  const diffHours = (Date.now() - createdTime) / (1000 * 60 * 60);
  return diffHours >= 2;
});

const filteredOrders = computed(() => {
  let result = orders.value;
  if (selectedStatus.value !== "all") {
    result = result.filter((o) => o.statusId === Number(selectedStatus.value));
  }
  if (searchQuery.value.trim() !== "") {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (o) =>
        o.orderId.toString().includes(q) ||
        o.receiverName.toLowerCase().includes(q) ||
        o.receiverPhone.includes(q),
    );
  }
  return result;
});

const printInvoice = () => window.print();

// 5. OnMounted duy nhất
onMounted(async () => {
  try {
    const statusRes = await axios.get(
      "http://localhost:8080/api/order-statuses",
    );
    orderStatuses.value = Array.isArray(statusRes.data) ? statusRes.data : [];
    await fetchOrders();
  } catch (error) {
    console.error("Lỗi khởi tạo:", error);
  }
});

</script>

<template>
  <div class="orders-tab-wrapper">
    <div class="admin-card animate-fade print-hide">
      <div class="table-control-bar">
        <div class="control-left">
          <div class="admin-search-box">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Tìm theo Mã đơn, Tên, SĐT khách..."
              class="input-admin-search"
            />
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <select v-model="selectedStatus" class="select-admin-filter">
            <option value="all">Tất cả trạng thái</option>
            <option
              v-for="st in orderStatuses"
              :key="st.statusId"
              :value="st.statusId"
            >
              {{ st.statusName }}
            </option>
          </select>
        </div>
      </div>

      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Mã Đơn</th>
              <th>Thời gian đặt</th>
              <th>Khách hàng</th>
              <th>Tài khoản</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Xử lý</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="order in filteredOrders" :key="order.orderId">
              <td>
                <strong>#{{ order.orderId }}</strong>
              </td>
              <td>
                <span class="date-text">{{ formatDate(order.createdAt) }}</span>
              </td>
              <td>
                <div class="customer-info-cell">
                  <span class="cus-name">{{ order.receiverName }}</span>
                  <span class="cus-phone"
                    ><i class="fa-solid fa-phone"></i>
                    {{ order.receiverPhone }}</span
                  >
                </div>
              </td>
              <td>
                <span class="badge-account">{{ order.customerName }}</span>
              </td>
              <td>
                <span class="table-price">{{
                  formatPrice(order.totalAmount)
                }}</span>
              </td>
              <td>
                <span
                  v-if="order.statusId"
                  :class="['status-badge', 'status-' + order.statusId]"
                >
                  {{ getStatusName(order.statusId) }}
                </span>
              </td>
              <td>
                <button class="btn-action-view" @click="openOrderDetail(order)">
                  Chi tiết
                </button>
                <button
                  class="btn-delete-order"
                  @click="deleteOrder(order.orderId)"
                >
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      :class="['admin-modal-overlay', { show: isModalOpen }]"
      class="print-overlay"
    >
      <div class="admin-modal-box modal-xl print-box" v-if="currentOrder">
        <div class="modal-header print-hide">
          <h3>Xử Lý Đơn Hàng #{{ currentOrder.orderId }}</h3>
          <button class="btn-close-modal" @click="isModalOpen = false">
            &times;
          </button>
        </div>

        <div class="modal-form-body invoice-body">
          <div class="invoice-header">
            <div class="brand-logo">
              KIT<span style="color: #4caf50">CHEF</span>
            </div>
            <div class="invoice-meta">
              <p>
                <strong>Ngày đặt:</strong>
                {{ formatDate(currentOrder.createdAt) }}
              </p>
              <p>
                <strong>Trạng thái:</strong>
                <span
                  :class="['status-badge', 'status-' + currentOrder.statusId]"
                  >{{ getStatusName(currentOrder.statusId) }}</span
                >
              </p>
            </div>
          </div>

          <div class="customer-address-box">
            <h4>Thông tin giao hàng</h4>
            <p><strong>Người nhận:</strong> {{ currentOrder.receiverName }}</p>
            <p><strong>Điện thoại:</strong> {{ currentOrder.receiverPhone }}</p>
            <p><strong>Địa chỉ:</strong> {{ currentOrder.receiverAddress }}</p>
            <p v-if="currentOrder.note" class="note-text">
              <strong>Ghi chú:</strong> {{ currentOrder.note }}
            </p>
          </div>

          <table class="invoice-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên sản phẩm</th>
                <th style="text-align: center">Số lượng</th>
                <th style="text-align: right">Đơn giá</th>
                <th style="text-align: right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in currentOrderDetails" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.productName }}</td>
                <td style="text-align: center">{{ item.quantity }}</td>
                <td style="text-align: right">{{ formatPrice(item.price) }}</td>
                <td style="text-align: right">
                  <strong>{{ formatPrice(item.price * item.quantity) }}</strong>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="invoice-summary">
            <div class="summary-row">
              <span>Tạm tính hàng hóa:</span>
              <span>{{
                formatPrice(
                  currentOrder.totalAmount -
                    currentOrder.shippingFee +
                    (currentOrder.voucherId ? 50000 : 0),
                )
              }}</span>
            </div>
            <div class="summary-row">
              <span>Phí vận chuyển:</span>
              <span>{{ formatPrice(currentOrder.shippingFee) }}</span>
            </div>
            <div class="summary-row" v-if="currentOrder.voucherId">
              <span>Giảm giá (Voucher):</span>
              <span style="color: #ff3b30">- 50.000 đ</span>
            </div>
            <div class="summary-row total-row">
              <span>SỐ TIỀN CẦN THU (COD):</span>
              <span class="total-price-text">{{
                formatPrice(currentOrder.totalAmount)
              }}</span>
            </div>
          </div>
        </div>

        <div class="modal-footer print-hide">
          <div class="action-group-left">
            <button type="button" class="btn-print" @click="printInvoice">
              <i class="fa-solid fa-print"></i> In Phiếu Giao
            </button>
          </div>

          <div class="action-group-right">
            <template v-if="currentOrder.statusName === 'Chờ duyệt'">
              <button
                v-if="canConfirmOrder"
                type="button"
                class="btn-confirm-order"
                @click="changeOrderStatus(2)"
              >
                <i class="fa-solid fa-check-double"></i> Chốt đơn
              </button>
              <button
                type="button"
                class="btn-cancel-order"
                @click="changeOrderStatus(6)"
              >
                Hủy đơn
              </button>
            </template>

            <template v-if="currentOrder.statusName === 'Đã xác nhận'">
              <button
                type="button"
                class="btn-shipping"
                @click="changeOrderStatus(3)"
              >
                <i class="fa-solid fa-truck-fast"></i> Giao cho Shipper
              </button>
            </template>

            <template v-if="currentOrder.statusId === 3">
              <button
                type="button"
                class="btn-success"
                @click="changeOrderStatus(4)"
              >
                <i class="fa-solid fa-box-open"></i> Khách đã nhận
              </button>
              <button
                type="button"
                class="btn-cancel-order"
                @click="changeOrderStatus(5)"
              >
                Giao thất bại
              </button>
            </template>

            <template v-if="currentOrder.statusId >= 4">
              <button
                type="button"
                class="btn-modal-cancel"
                @click="isModalOpen = false"
              >
                Đóng cửa sổ
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========================================================
   CSS MỚI THÊM CHO PHẦN KHÓA SỐ LƯỢNG
   ======================================================== */
.qty-cell-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.qty-locked-box {
  display: flex;
  align-items: center;
  gap: 8px;
}
.qty-number {
  font-weight: 700;
  font-size: 1rem;
  color: #1a251e;
}
.btn-unlock-qty {
  background-color: #f1f1f1;
  border: 1px solid #ddd;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
}
.btn-unlock-qty:hover {
  background-color: #e5e5e5;
  color: #1a251e;
  border-color: #ccc;
}

.qty-edit-box {
  display: inline-flex;
  align-items: center;
  border: 1px solid #cedbd0;
  border-radius: 6px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.qty-edit-box button {
  background-color: #f9fbf9;
  border: none;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}
.qty-edit-box button:hover {
  background-color: #e1ebe3;
}
.qty-edit-box span {
  width: 35px;
  text-align: center;
  font-weight: 700;
  border-left: 1px solid #eef3ef;
  border-right: 1px solid #eef3ef;
}
.btn-lock-qty {
  background-color: #e8f5ec !important;
  border-left: 1px solid #cedbd0 !important;
  color: #4caf50;
  width: 30px !important;
}
.btn-lock-qty:hover {
  background-color: #4caf50 !important;
  color: white !important;
}

/* ========================================================
   CÁC CSS CŨ GIỮ NGUYÊN
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

.date-text {
  font-size: 0.85rem;
  color: #666;
  font-weight: 600;
}
.customer-info-cell {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.cus-name {
  font-weight: 700;
  color: #1a251e;
}
.cus-phone {
  font-size: 0.8rem;
  color: #888;
  display: flex;
  align-items: center;
  gap: 5px;
}
.table-price {
  font-weight: 800;
  color: #ff3b30;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid transparent;
  display: inline-block;
}
.status-1 {
  background-color: #fff0eb;
  color: #ff6b00;
  border-color: #ffe0cc;
}
.status-2 {
  background-color: #e8f0fe;
  color: #1a73e8;
  border-color: #cce5ff;
}
.status-3 {
  background-color: #fff4e5;
  color: #ff9800;
  border-color: #ffe0b2;
}
.status-4 {
  background-color: #e8f5ec;
  color: #4caf50;
  border-color: #c3e6cb;
}
.status-5,
.status-6 {
  background-color: #fbebe9;
  color: #ff3b30;
  border-color: #f5c6cb;
  text-decoration: line-through;
}

.btn-action-view {
  background-color: #f9fbf9;
  border: 1px solid #cedbd0;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  color: #2c3e50;
  transition: all 0.2s;
}
.btn-action-view:hover {
  background-color: #e8f5ec;
  border-color: #4caf50;
  color: #4caf50;
}
.text-center-empty {
  text-align: center;
  padding: 40px 0 !important;
  color: #888;
  font-weight: 600;
}

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
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transform: translateY(-20px);
  transition: transform 0.3s ease;
}
.admin-modal-overlay.show .admin-modal-box {
  transform: translateY(0);
}
.modal-xl {
  max-width: 850px !important;
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

.invoice-body {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 70vh;
  overflow-y: auto;
}
.invoice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #1a251e;
  padding-bottom: 15px;
}
.brand-logo {
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: 1px;
  color: #1a251e;
}
.invoice-meta p {
  margin: 5px 0;
  font-size: 0.9rem;
  text-align: right;
}

.customer-address-box {
  background-color: #f9fbf9;
  padding: 20px;
  border-radius: 8px;
  border: 1px dashed #cedbd0;
}
.customer-address-box h4 {
  margin: 0 0 10px 0;
  font-size: 1.05rem;
  color: #2c3e50;
}
.customer-address-box p {
  margin: 5px 0;
  font-size: 0.95rem;
  color: #4a554f;
}
.note-text {
  color: #ff6b00 !important;
  font-style: italic;
}

.invoice-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
.invoice-table th,
.invoice-table td {
  border-bottom: 1px solid #eef3ef;
  padding: 12px;
  font-size: 0.95rem;
}
.invoice-table th {
  background-color: #f8faf8;
  font-weight: 700;
  color: #1a251e;
}

.invoice-summary {
  margin-top: 20px;
  width: 350px;
  align-self: flex-end;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: #4a554f;
}
.total-row {
  border-top: 2px solid #eef3ef;
  padding-top: 15px;
  margin-top: 5px;
  font-weight: 800;
  color: #1a251e;
  align-items: center;
}
.total-price-text {
  font-size: 1.4rem;
  color: #ff3b30;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background-color: #f8faf8;
  border-top: 1px solid #eef3ef;
}
.action-group-right {
  display: flex;
  gap: 10px;
  align-items: center;
}
.btn-print {
  background-color: #ffffff;
  border: 1px solid #cedbd0;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  color: #2c3e50;
}
.btn-print:hover {
  background-color: #f1f1f1;
}
.warning-text {
  color: #ff6b00;
  font-size: 0.9rem;
  font-weight: 600;
  margin-right: 15px;
}

.btn-confirm-order {
  background-color: #1a73e8;
  border: none;
  padding: 10px 20px;
  color: white;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}
.btn-confirm-order:hover {
  background-color: #155dbb;
}
.btn-shipping {
  background-color: #ff9800;
  border: none;
  padding: 10px 20px;
  color: white;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}
.btn-success {
  background-color: #4caf50;
  border: none;
  padding: 10px 20px;
  color: white;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}
.btn-cancel-order {
  background-color: transparent;
  border: 1px solid #ff3b30;
  color: #ff3b30;
  padding: 10px 15px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}
.btn-cancel-order:hover {
  background-color: #ff3b30;
  color: white;
}
.btn-modal-cancel {
  background-color: #e5e5e5;
  border: none;
  padding: 10px 20px;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  color: #666;
}

@media print {
  body * {
    visibility: hidden;
  }
  .print-overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: white !important;
    z-index: 9999;
    display: block;
  }
  .print-box {
    box-shadow: none !important;
    transform: none !important;
    max-width: 100% !important;
    border: none !important;
  }
  .invoice-body {
    visibility: visible;
    overflow: visible !important;
    padding: 0;
  }
  .invoice-body * {
    visibility: visible;
  }
  .print-hide {
    display: none !important;
  }
}

.btn-delete-order {
  background-color: #fff0eb;
  border: 1px solid #ffccbc;
  color: #ff3b30;
  padding: 8px 12px;
  border-radius: 6px;
  margin-left: 5px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-delete-order:hover {
  background-color: #ff3b30;
  color: white;
}

.badge-account {
  background-color: #e8f5ec;
  color: #2e7d32;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 700;
}
</style>
