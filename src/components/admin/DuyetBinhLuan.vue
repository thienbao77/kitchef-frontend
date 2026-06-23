<script setup>
import { ref, computed } from "vue";

// ========================================================
// 1. DỮ LIỆU GIẢ LẬP (Bảng Reviews)
// ========================================================
const reviews = ref([
  {
    review_id: 1,
    customer_name: "Nguyễn Văn A",
    product_name: "Nồi Gang KitChef Đỏ",
    rating_stars: 5,
    comment: "Chảo rất nặng tay, dùng rất thích!",
    created_at: "2026-06-05T09:00",
    is_hidden: false,
  },
  {
    review_id: 2,
    customer_name: "Trần Thị B",
    product_name: "Bộ Dao Damascus",
    rating_stars: 1,
    comment: "Hàng lởm nhé, dùng 2 hôm đã cùn!",
    created_at: "2026-06-06T10:30",
    is_hidden: false,
  },
  {
    review_id: 3,
    customer_name: "Hoàng C",
    product_name: "Chảo Vân Đá Tefal",
    rating_stars: 4,
    comment: "Cũng ổn, giao hàng nhanh.",
    created_at: "2026-06-07T08:15",
    is_hidden: false,
  },
  {
    review_id: 4,
    customer_name: "User Spam",
    product_name: "Nồi Gang KitChef Đỏ",
    rating_stars: 1,
    comment: "Link web rác: www.spam-hacker.com",
    created_at: "2026-06-07T09:00",
    is_hidden: false,
  },
]);

// ========================================================
// 2. BỘ LỌC
// ========================================================
const searchQuery = ref("");
const filteredReviews = computed(() => {
  return reviews.value.filter(
    (r) =>
      r.comment.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.customer_name.toLowerCase().includes(searchQuery.value.toLowerCase()),
  );
});

// ========================================================
// 3. LOGIC XỬ LÝ (Ẩn hoặc Xóa)
// ========================================================
const toggleHide = (review) => {
  review.is_hidden = !review.is_hidden;
};

const deleteReview = (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa vĩnh viễn bình luận này?")) {
    reviews.value = reviews.value.filter((r) => r.review_id !== id);
  }
};
</script>

<template>
  <div class="reviews-tab-wrapper">
    <div class="admin-card animate-fade">
      <div class="table-control-bar">
        <h3>Quản lý bình luận & đánh giá</h3>
        <div class="admin-search-box">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Tìm kiếm nội dung, tên khách..."
            class="input-admin-search"
          />
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>

      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Đánh giá</th>
              <th>Nội dung</th>
              <th>Ngày đăng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="r in filteredReviews"
              :key="r.review_id"
              :class="{ 'row-hidden': r.is_hidden }"
            >
              <td>
                <strong>{{ r.customer_name }}</strong>
              </td>
              <td>{{ r.product_name }}</td>
              <td>
                <div class="star-rating">
                  <i
                    v-for="i in 5"
                    :key="i"
                    :class="
                      i <= r.rating_stars
                        ? 'fa-solid fa-star'
                        : 'fa-regular fa-star'
                    "
                  ></i>
                </div>
              </td>
              <td class="comment-cell">{{ r.comment }}</td>
              <td>{{ new Date(r.created_at).toLocaleDateString("vi-VN") }}</td>
              <td>
                <div class="table-actions">
                  <button
                    :class="['btn-action-hide', { active: r.is_hidden }]"
                    :title="r.is_hidden ? 'Bỏ ẩn' : 'Ẩn bình luận'"
                    @click="toggleHide(r)"
                  >
                    <i
                      :class="
                        r.is_hidden
                          ? 'fa-solid fa-eye'
                          : 'fa-solid fa-eye-slash'
                      "
                    ></i>
                  </button>
                  <button
                    class="btn-action-delete"
                    title="Xóa"
                    @click="deleteReview(r.review_id)"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
}
.table-control-bar h3 {
  margin: 0;
  color: #1a251e;
}
.admin-search-box {
  position: relative;
  width: 300px;
}
.input-admin-search {
  width: 100%;
  padding: 10px 15px 10px 40px;
  border: 1px solid #cedbd0;
  border-radius: 6px;
  box-sizing: border-box;
}
.admin-search-box i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}
.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}
.admin-table th {
  background-color: #f8faf8;
  padding: 15px;
  border-bottom: 2px solid #eef3ef;
}
.admin-table td {
  padding: 15px;
  border-bottom: 1px solid #eef3ef;
}
.star-rating {
  color: #ffb400;
  font-size: 0.8rem;
}
.comment-cell {
  max-width: 300px;
  color: #4a554f;
}
.row-hidden {
  opacity: 0.5;
  background-color: #f9f9f9;
}
.table-actions {
  display: flex;
  gap: 10px;
}
.btn-action-hide,
.btn-action-delete {
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-action-hide {
  background-color: #e8f0fe;
  color: #1a73e8;
}
.btn-action-hide.active {
  background-color: #ff9800;
  color: white;
}
.btn-action-delete {
  background-color: #fbebe9;
  color: #ff3b30;
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
