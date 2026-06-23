import axios from 'axios';

const API_URL = 'http://localhost:8080/api/products';

export default {
    getAllProducts() {
        return axios.get(API_URL);
    },
    // Bạn có thể thêm các hàm create, update, delete ở đây
}