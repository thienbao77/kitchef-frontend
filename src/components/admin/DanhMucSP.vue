<script setup>
import { ref, computed, watch } from "vue";
import axios from "axios";
import { onMounted } from "vue";


const subTab = ref("productList");
// Chỉ để lại duy nhất 1 đoạn này:
watch(subTab, (newVal) => {
  if (newVal === 'productList') {
    fetchProductsFromAPI(); // Tự động load lại kho mới nhất từ DB
  }
});
// ========================================================
// 1. DỮ LIỆU GIẢ LẬP KHỚP VỚI DATABASE MỚI (Có Slug)
// ========================================================
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

// SỬA THÀNH:
const products = ref([]);

// ========================================================
// 2. BỘ LỌC VÀ TÌM KIẾM
// ========================================================
const searchQuery = ref("");
const adminSelectedCategory = ref("all");

const filteredProducts = computed(() => {
  if (!products.value) return [];

  return products.value.filter((p) => {
    // 1. Tìm kiếm theo tên (giữ nguyên logic của bạn)
    const name = p.productName ? p.productName.toLowerCase() : "";
    const matchSearch = name.includes(searchQuery.value.toLowerCase());

    // 2. Tìm kiếm theo danh mục (SỬA Ở ĐÂY)
    // Lấy ID danh mục từ sản phẩm (phòng hờ trường hợp prod.category là null)
    const productCategoryId = p.category ? Number(p.category.id) : null;

    // Nếu chọn "all" thì hiển thị tất cả, ngược lại so sánh ID
    const matchCat =
      adminSelectedCategory.value === "all" ||
      productCategoryId === Number(adminSelectedCategory.value);

    return matchSearch && matchCat;
  });
});

const getCategoryName = (catId) => {
  const cat = categories.value.find((c) => c.category_id === catId);
  return cat ? cat.category_name : "Chưa phân loại";
};

const formatPrice = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

// ========================================================
// 3. LOGIC XỬ LÝ FORM MODAL (CRUD VỚI NHIỀU ẢNH)
// ========================================================
const isModalOpen = ref(false);
const modalMode = ref("add");

// Object Form chuẩn theo Bảng Products + ProductImages
const productForm = ref({
  product_id: null,
  product_name: "",
  slug: "",
  category_id: "",
  price: 0,
  stock_quantity: 0,
  description: "",
  image_url: "", // Ảnh đại diện
  is_active: true,
  extra_images: [], // Mảng chứa các ảnh phụ { url: '', display_order: 1 }
});

// Hàm tự động tạo Slug SEO từ tên sản phẩm
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng Việt
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9 -]/g, "") // Xóa ký tự đặc biệt
    .replace(/\s+/g, "-") // Thay khoảng trắng bằng dấu gạch ngang
    .replace(/-+/g, "-"); // Xóa các dấu gạch ngang liền nhau
};

// Lắng nghe: Khi gõ tên sản phẩm, tự động điền Slug (Chỉ ở chế độ Thêm mới)
watch(
  () => productForm.value.product_name,
  (newVal) => {
    if (modalMode.value === "add" && newVal) {
      productForm.value.slug = generateSlug(newVal);
    }
  },
);

// Các hàm thao tác Mảng Ảnh Chi Tiết (Bảng ProductImages)
const addExtraImage = () => {
  const nextOrder = productForm.value.extra_images.length + 1;
  productForm.value.extra_images.push({ url: "", display_order: nextOrder });
};

const removeExtraImage = (index) => {
  productForm.value.extra_images.splice(index, 1);
};

// Đóng mở Form
// Trong hàm openAddModal:
const openAddModal = () => {
  modalMode.value = "add";
  productForm.value = {
    // Sử dụng productForm để chứa dữ liệu form, không dùng chung với mảng products
    product_id: null,
    product_name: "",
    slug: "",
    category_id: "",
    price: 0,
    stock_quantity: 0,
    description: "",
    image_url: "",
    is_active: true,
    extra_images: [],
  };
  isModalOpen.value = true;
};

const openEditModal = (product) => {
  modalMode.value = "edit";

  productForm.value = {
    product_id: product.productId,
    product_name: product.productName,
    slug: product.slug,
    // Sửa chỗ này: Lấy .id từ đối tượng category
    categoryId: product.category ? product.category.id : "",
    price: product.price,
    stock_quantity: product.stockQuantity,
    description: product.description,
    image_url: product.imageUrl,
    is_active: product.isActive,
    extra_images: product.images
      ? product.images.map((img) => ({ url: img.imageUrl }))
      : [],
  };
  isModalOpen.value = true;
};

const deleteProduct = async (id) => {
  if (confirm("Bạn có chắc chắn muốn xóa?")) {
    try {
      // 1. Gửi lệnh xóa lên Server
      const response = await axios.delete(
        `http://localhost:8080/api/products/${id}`,
      );

      // 2. Chỉ khi xóa thành công ở server, mới cập nhật lại giao diện
      await fetchProductsFromAPI();
      alert("Xóa thành công!");
    } catch (error) {
      // Nếu có lỗi (lỗi 500, 404,...) nó sẽ nhảy vào đây
      console.error("Lỗi chi tiết:", error.response?.data);
      alert("Xóa thất bại! Sản phẩm đang được sử dụng trong đơn hàng.");
    }
  }
};

const saveProduct = async () => {
  try {
    // 1. Chuẩn bị dữ liệu (mapping lại tên trường cho đúng DTO)
    // Trong hàm saveProduct:
    const payload = {
      productName: productForm.value.product_name,
      slug: productForm.value.slug,
      price: productForm.value.price,
      stockQuantity: productForm.value.stock_quantity,
      description: productForm.value.description,
      imageUrl: productForm.value.image_url,
      categoryId: Number(productForm.value.categoryId), // Phải là categoryId (CamelCase)
      isActive: productForm.value.is_active,
      extraImageUrls: productForm.value.extra_images.map((img) => img.url),
    };

    if (modalMode.value === "add") {
      await axios.post("http://localhost:8080/api/products", payload);
    } else {
      // KIỂM TRA ID TRƯỚC KHI GỬI
      const id = productForm.value.product_id || productForm.value.productId;
      if (!id) {
        alert("Lỗi: Không tìm thấy ID sản phẩm!");
        return;
      }
      await axios.put(`http://localhost:8080/api/products/${id}`, payload);
    }

    await fetchProductsFromAPI();
    isModalOpen.value = false;
  } catch (error) {
    console.error("Lỗi:", error.response?.data || error);
  }
};

// Hàm load dữ liệu từ Database thật
const fetchProductsFromAPI = async () => {
  const res = await axios.get("http://localhost:8080/api/products");
  // Thay vì gán trực tiếp, hãy tạo một bản sao mới để Vue "thấy" sự thay đổi
  products.value = [...res.data];
};

// Thêm dòng này ở phía cuối script setup
// Thêm hàm này vào script setup
const fetchCategories = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/categories");
    categories.value = res.data; // Cập nhật danh sách thật từ Backend
  } catch (error) {
    console.error("Lỗi lấy danh mục:", error);
  }
};

onMounted(() => {
  fetchProductsFromAPI();
  fetchCategories(); // Gọi để nạp danh sách danh mục
});
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
        <i class="fa-solid fa-folder"></i> Danh mục sản phẩm
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
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.categoryName }}
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
              <th>Tên sản phẩm / URL</th>
              <th>Danh mục</th>
              <th>Giá bán</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="prod in filteredProducts" :key="prod.productId">
              <td>
                <strong>#{{ prod.productId }}</strong>
              </td>
              <td>
                <img
                  :src="prod.imageUrl"
                  class="table-product-thumb"
                  alt="thumb"
                />
              </td>
              <td>
                <div class="prod-name-cell">
                  <span class="table-product-name" :title="prod.productName">{{
                    prod.productName
                  }}</span>
                  <span class="table-product-slug">/{{ prod.slug }}</span>
                </div>
              </td>
              <td>
                <span class="badge-cat-label">
                  {{ prod.category?.categoryName || "Chưa phân loại" }}
                </span>
              </td>
              <td>
                <span class="table-price">{{ formatPrice(prod.price) }}</span>
              </td>
              <td>
                <span
                  :class="[
                    'stock-indicator',
                    prod.stockQuantity < 10 ? 'low-stock' : 'good-stock',
                  ]"
                >
                  {{ prod.stockQuantity }} cái
                </span>
              </td>
              <td>
                <span
                  :class="[
                    'status-badge',
                    prod.isActive ? 'active-status' : 'disabled-status',
                  ]"
                >
                  {{ prod.isActive ? "Đang bán" : "Ẩn" }}
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
                    @click="deleteProduct(prod.productId)"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredProducts.length === 0">
              <td colspan="8" class="text-center-empty">
                Không tìm thấy sản phẩm nào!
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
            <tr v-for="cat in categories" :key="cat.id">
              <td>
                <strong>#{{ cat.id }}</strong>
              </td>
              <td>
                <span class="category-name-bold">{{ cat.categoryName }}</span>
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
      <div class="admin-modal-box modal-lg">
        <div class="modal-header">
          <h3>
            {{
              modalMode === "add" ? "Thêm Sản Phẩm Mới" : "Cập Nhật Sản Phẩm"
            }}
          </h3>
          <button class="btn-close-modal" @click="isModalOpen = false">
            &times;
          </button>
        </div>

        <div class="modal-scroll-area">
          <form
            id="productCrudForm"
            @submit.prevent="saveProduct"
            class="modal-form-body"
          >
            <div class="form-row">
              <div class="form-group" style="flex: 2">
                <label>Tên sản phẩm <span class="required">*</span></label>
                <input
                  type="text"
                  v-model="productForm.product_name"
                  required
                  placeholder="VD: Nồi gang đúc tráng men đỏ..."
                />
              </div>
              <div class="form-group" style="flex: 1">
                <label>Danh mục bếp <span class="required">*</span></label>
                <select v-model="productForm.categoryId" required>
                  <option value="" disabled>-- Chọn --</option>
                  <option
                    v-for="cat in categories"
                    :key="cat.id"
                    :value="cat.id"
                  >
                    {{ cat.categoryName }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label
                >Đường dẫn tĩnh SEO (Slug)
                <span class="required">*</span></label
              >
              <div class="slug-input-wrapper">
                <span class="slug-prefix">kitchef.vn/</span>
                <input
                  type="text"
                  v-model="productForm.slug"
                  required
                  class="slug-input"
                />
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
                <label>Tồn kho <span class="required">*</span></label>
                <input
                  type="number"
                  v-model.number="productForm.stock_quantity"
                  min="0"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label
                >Link ảnh đại diện (Thumbnail URL)
                <span class="required">*</span></label
              >
              <input
                type="text"
                v-model="productForm.image_url"
                required
                placeholder="Link hiển thị ngoài danh sách..."
              />
            </div>

            <div class="form-group">
              <label>Mô tả chi tiết</label>
              <textarea
                v-model="productForm.description"
                rows="3"
                placeholder="Thông số kỹ thuật..."
              ></textarea>
            </div>

            <div class="gallery-section">
              <div class="gallery-header">
                <label>Các ảnh hiển thị chi tiết bên trong (Tuỳ chọn)</label>
                <button
                  type="button"
                  class="btn-add-img"
                  @click="addExtraImage"
                >
                  <i class="fa-solid fa-plus"></i> Thêm ảnh phụ
                </button>
              </div>

              <div
                class="gallery-list"
                v-if="
                  productForm.extra_images &&
                  productForm.extra_images.length > 0
                "
              >
                <div
                  class="gallery-item"
                  v-for="(img, index) in productForm.extra_images"
                  :key="index"
                >
                  <div class="form-group" style="margin-bottom: 0">
                    <input
                      type="text"
                      v-model="img.url"
                      placeholder="Nhập đường link ảnh..."
                      required
                    />
                  </div>
                  <button
                    type="button"
                    class="btn-remove-img"
                    @click="removeExtraImage(index)"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              </div>
              <div class="gallery-empty" v-else>
                Chưa có ảnh phụ nào được thêm.
              </div>
            </div>

            <div class="form-group checkbox-group" style="margin-top: 10px">
              <input
                type="checkbox"
                id="modal-active-chk"
                v-model="productForm.is_active"
              />
              <label for="modal-active-chk"
                >Hiển thị bán ngay trên Website</label
              >
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn-modal-cancel"
            @click="isModalOpen = false"
          >
            Hủy bỏ
          </button>
          <button type="submit" form="productCrudForm" class="btn-modal-submit">
            Lưu Sản Phẩm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* CSS DÀNH RIÊNG CHO SẢN PHẨM MỚI */
.prod-name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.table-product-slug {
  font-size: 0.75rem;
  color: #888;
  letter-spacing: 0.5px;
}

/* SLUG INPUT STYLING */
.slug-input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #cedbd0;
  border-radius: 6px;
  overflow: hidden;
  background-color: #f9fbf9;
}
.slug-prefix {
  padding: 11px 15px;
  background-color: #e1ebe3;
  color: #666;
  font-size: 0.85rem;
  font-weight: 600;
  border-right: 1px solid #cedbd0;
}
.slug-input {
  flex: 1;
  border: none !important;
  border-radius: 0 !important;
  outline: none;
  background-color: transparent;
}
.slug-input:focus {
  box-shadow: none !important;
  background-color: #ffffff;
}

/* GALLERY SECTION STYLING (NHIỀU ẢNH) */
.gallery-section {
  background-color: #f4fbf6;
  border: 1px dashed #4caf50;
  border-radius: 8px;
  padding: 15px;
}
.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.btn-add-img {
  background-color: #e8f5ec;
  color: #4caf50;
  border: 1px solid #4caf50;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}
.btn-add-img:hover {
  background-color: #4caf50;
  color: white;
}
.gallery-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.gallery-item {
  display: flex;
  gap: 10px;
  align-items: center;
}
.gallery-item .form-group {
  flex: 1;
}
.btn-remove-img {
  background-color: #fbebe9;
  color: #ff3b30;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}
.btn-remove-img:hover {
  background-color: #ff3b30;
  color: white;
}
.gallery-empty {
  font-size: 0.85rem;
  color: #888;
  font-style: italic;
  text-align: center;
  padding: 10px 0;
}

/* Modal Large cho Form dài */
.modal-lg {
  max-width: 800px !important;
}
.modal-scroll-area {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}
.modal-scroll-area::-webkit-scrollbar {
  width: 6px;
}
.modal-scroll-area::-webkit-scrollbar-thumb {
  background-color: #cedbd0;
  border-radius: 4px;
}

/* ========================================================
   CSS ĐỒNG BỘ CỐT LÕI ADMIN 
   ======================================================== */
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
  padding: 20px 25px;
  background-color: #f8faf8;
  border-top: 1px solid #eef3ef;
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
