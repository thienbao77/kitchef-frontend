<script setup>
import { ref, computed } from "vue";

// ========================================================
// 1. DỮ LIỆU GIẢ LẬP KHỚP VỚI BẢNG LIÊN HỆ / PHẢN HỒI
// ========================================================
const feedbacks = ref([
  {
    id: 1,
    customer_name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0901234567",
    title: "Hỏi về chính sách bảo hành",
    message:
      "Cho mình hỏi chảo gang Lodge mua bên bạn được bảo hành gỉ sét trong bao lâu ạ?",
    created_at: "2026-05-30T09:15",
    status: "pending", // pending (Chờ xử lý)
    reply_note: "",
  },
  {
    id: 2,
    customer_name: "Trần Thị B",
    email: "tranthib_kh@gmail.com",
    phone: "0987654321",
    title: "Giao thiếu phụ kiện",
    message:
      "Đơn hàng #10045 của mình mua bộ dao nhưng mở ra không thấy dụng cụ mài dao đi kèm. Shop kiểm tra lại giúp.",
    created_at: "2026-05-29T14:30",
    status: "pending",
    reply_note: "",
  },
  {
    id: 3,
    customer_name: "Lê Hoàng C",
    email: "hoangc1995@gmail.com",
    phone: "0933444555",
    title: "Tư vấn mua lò nướng",
    message:
      "Mình muốn mua một lò nướng dung tích khoảng 30L để tập làm bánh, tài chính tầm 2 triệu, shop tư vấn giúp nhé.",
    created_at: "2026-05-28T10:00",
    status: "resolved", // resolved (Đã xử lý)
    reply_note:
      "Đã gọi điện trực tiếp tư vấn mẫu Lò vi sóng điện tử kèm nướng 23L và khách đã chốt đơn.",
  },
]);

// ========================================================
// 2. BỘ LỌC VÀ TÌM KIẾM ĐỘNG
// ========================================================
const searchQuery = ref("");
const selectedStatus = ref("all");

const filteredFeedbacks = computed(() => {
  return feedbacks.value.filter((fb) => {
    const matchSearch =
      fb.customer_name
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase()) ||
      fb.email.toLowerCase().includes(searchQuery.value.toLowerCase());

    let matchStatus = true;
    if (selectedStatus.value !== "all") {
      matchStatus = fb.status === selectedStatus.value;
    }

    return matchSearch && matchStatus;
  });
});

const formatDateDisplay = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// ========================================================
// 3. LOGIC XỬ LÝ FORM MODAL (ĐỌC VÀ TRẢ LỜI)
// ========================================================
const isModalOpen = ref(false);
const currentFeedback = ref(null);
const replyText = ref("");

// Mở form xem chi tiết và trả lời
const openReplyModal = (feedback) => {
  currentFeedback.value = { ...feedback };
  replyText.value = feedback.reply_note || "";
  isModalOpen.value = true;
};

// Xử lý gửi phản hồi (Mô phỏng)
const sendReply = () => {
  const index = feedbacks.value.findIndex(
    (fb) => fb.id === currentFeedback.value.id,
  );
  if (index !== -1) {
    feedbacks.value[index].status = "resolved"; // Đổi trạng thái thành Đã xử lý
    feedbacks.value[index].reply_note = replyText.value;
  }
  isModalOpen.value = false;
  alert(
    "Đã gửi email phản hồi cho khách hàng và cập nhật trạng thái thành công!",
  );
};

// Xóa phản hồi (Nếu là tin nhắn spam)
const deleteFeedback = (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa tin nhắn này khỏi hệ thống?")) {
    feedbacks.value = feedbacks.value.filter((fb) => fb.id !== id);
  }
};
</script>

<template>
  <div class="feedback-tab-wrapper">
    <div class="admin-card animate-fade">
      <div class="table-control-bar">
        <div class="control-left">
          <div class="admin-search-box">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Tìm kiếm tên, email khách hàng..."
              class="input-admin-search"
            />
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <select v-model="selectedStatus" class="select-admin-filter">
            <option value="all">Tất cả tin nhắn</option>
            <option value="pending">Chờ xử lý (Chưa đọc)</option>
            <option value="resolved">Đã xử lý xong</option>
          </select>
        </div>
      </div>

      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Khách hàng</th>
              <th>Tiêu đề / Nội dung</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="fb in filteredFeedbacks"
              :key="fb.id"
              :class="{ 'row-unread': fb.status === 'pending' }"
            >
              <td>
                <span class="date-text">{{
                  formatDateDisplay(fb.created_at)
                }}</span>
              </td>
              <td>
                <div class="contact-info-cell">
                  <span class="customer-name">{{ fb.customer_name }}</span>
                  <span class="customer-sub"
                    ><i class="fa-regular fa-envelope"></i> {{ fb.email }}</span
                  >
                  <span class="customer-sub"
                    ><i class="fa-solid fa-phone"></i> {{ fb.phone }}</span
                  >
                </div>
              </td>
              <td class="message-cell">
                <span class="msg-title">{{ fb.title }}</span>
                <span class="msg-excerpt">{{ fb.message }}</span>
              </td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    fb.status === 'pending'
                      ? 'status-pending'
                      : 'status-resolved',
                  ]"
                >
                  {{ fb.status === "pending" ? "Chờ xử lý" : "Đã xử lý" }}
                </span>
              </td>
              <td>
                <div class="table-actions">
                  <button
                    class="btn-action-reply"
                    title="Xem & Phản hồi"
                    @click="openReplyModal(fb)"
                  >
                    <i class="fa-solid fa-reply"></i>
                  </button>
                  <button
                    class="btn-action-delete"
                    title="Xóa tin nhắn (Spam)"
                    @click="deleteFeedback(fb.id)"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredFeedbacks.length === 0">
              <td colspan="5" class="text-center-empty">
                Tuyệt vời! Không có khiếu nại hay tin nhắn nào đang chờ xử lý.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div :class="['admin-modal-overlay', { show: isModalOpen }]">
      <div class="admin-modal-box modal-lg">
        <div class="modal-header">
          <h3>Chi Tiết Tin Nhắn & Phản Hồi</h3>
          <button class="btn-close-modal" @click="isModalOpen = false">
            &times;
          </button>
        </div>

        <div class="modal-form-body" v-if="currentFeedback">
          <div class="customer-message-box">
            <div class="msg-header">
              <div class="sender-info">
                <strong>{{ currentFeedback.customer_name }}</strong>
                <span>&lt;{{ currentFeedback.email }}&gt;</span>
              </div>
              <div class="time-info">
                {{ formatDateDisplay(currentFeedback.created_at) }}
              </div>
            </div>
            <h4 class="msg-box-title">
              Cần hỗ trợ: {{ currentFeedback.title }}
            </h4>
            <p class="msg-box-content">{{ currentFeedback.message }}</p>
          </div>

          <hr class="modal-divider" />

          <form @submit.prevent="sendReply">
            <div class="form-group">
              <label
                >Nội dung phản hồi (Gửi email cho khách)
                <span class="required">*</span></label
              >
              <textarea
                v-model="replyText"
                rows="6"
                required
                placeholder="Xin chào quý khách, KitChef xin phép phản hồi về vấn đề của quý khách như sau..."
                :disabled="currentFeedback.status === 'resolved' && !replyText"
              ></textarea>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn-modal-cancel"
                @click="isModalOpen = false"
              >
                Đóng
              </button>
              <button type="submit" class="btn-modal-submit">
                <i class="fa-solid fa-paper-plane"></i>
                {{
                  currentFeedback.status === "pending"
                    ? "Gửi phản hồi & Đóng ca"
                    : "Cập nhật lại phản hồi"
                }}
              </button>
            </div>
          </form>
        </div>
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

/* Làm nổi bật dòng chưa đọc */
.row-unread {
  background-color: #fdfafa;
}
.row-unread td {
  font-weight: 600;
  color: #1a251e;
}

/* Thông tin khách hàng */
.contact-info-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.customer-name {
  font-weight: 700;
  color: #1a251e;
  font-size: 0.95rem;
}
.customer-sub {
  font-size: 0.8rem;
  color: #888;
  display: flex;
  align-items: center;
  gap: 6px;
}
.customer-sub i {
  color: #a0a0a0;
}

/* Nội dung tin nhắn */
.message-cell {
  max-width: 350px;
}
.msg-title {
  display: block;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}
.msg-excerpt {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: #666;
  font-size: 0.85rem;
  line-height: 1.4;
}

/* Trạng thái tin nhắn */
.status-badge {
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
}
.status-pending {
  background-color: #fff0eb;
  color: #ff6b00;
  border: 1px solid #ffe0cc;
}
.status-resolved {
  background-color: #e8f5ec;
  color: #4caf50;
  border: 1px solid #c3e6cb;
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
.btn-action-reply {
  background-color: #e8f0fe;
  color: #1a73e8;
}
.btn-action-reply:hover {
  background-color: #1a73e8;
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
.date-text {
  font-size: 0.85rem;
  color: #666;
}

/* MODAL CHI TIẾT */
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
  max-width: 700px;
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

/* Khung tin nhắn của khách trong Modal */
.customer-message-box {
  background-color: #f9fbf9;
  border: 1px solid #e1ebe3;
  border-radius: 8px;
  padding: 20px;
}
.msg-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 0.9rem;
}
.sender-info strong {
  color: #1a251e;
}
.sender-info span {
  color: #666;
  margin-left: 5px;
}
.time-info {
  color: #888;
}
.msg-box-title {
  margin: 0 0 10px 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #2c3e50;
}
.msg-box-content {
  margin: 0;
  line-height: 1.6;
  color: #4a554f;
}

.modal-divider {
  border: 0;
  border-top: 1px dashed #cedbd0;
  margin: 10px 0;
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
.form-group textarea {
  padding: 15px;
  border: 1px solid #cedbd0;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  font-family: inherit;
  resize: vertical;
}
.form-group textarea:focus {
  border-color: #4caf50;
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.15);
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
  background-color: #1a73e8;
  border: none;
  padding: 11px 25px;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-modal-submit:hover {
  background-color: #155dbb;
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
