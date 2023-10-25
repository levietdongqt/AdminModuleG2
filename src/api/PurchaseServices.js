import axios from 'axios';
import baseRequest from '../contexts/AxiosContext';

// GET ALL PURCHASE
export const getAllPurchase = async (search, st, page, pageSize) => {
  try {
    let response;
    if (search !== null) {
      response = await baseRequest.get(
        `${process.env.REACT_APP_API_BASE_URL}/User/GetAllPurchase?search=${search}&&page=${page}&&pageSize=${pageSize}`
      );
    } else {
      response = await baseRequest.get(
        `${process.env.REACT_APP_API_BASE_URL}/User/GetAllPurchase?page=${page}&&pageSize=${pageSize}`
      );
    }

    return response.data.result;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// GET PURCHASE BYID
export const getPurchaseById = async (id) => {
  try {
    const response = await baseRequest.get(`/User/GetPurchaseById?id=${id}`);
    return response.data.result;
  } catch (error) {
    // Bắt lỗi và xử lý tại đây
    if (error.response) {
      // Lỗi từ phía server, ví dụ: status code không phải 2xx
      console.error('Lỗi từ server:', error.response.status, error.response.data);
    } else if (error.request) {
      // Không nhận được phản hồi từ server
      console.error('Không kết nối được tới server:', error.request);
    } else {
      // Lỗi khác
      console.error('Lỗi:', error.message);
    }

    // Trả về một giá trị mà bạn xác định để xử lý lỗi tại nơi gọi hàm này
    return null; // Hoặc throw một exception
  }
};

// GET PUSRCHAS BY USERID & STATUS
export const getPurchasesByStatus = async (userId, statuses) => {
  try {
    const statusesParam = statuses.map((status) => `statuses=${encodeURIComponent(status)}`).join('&');
    const url = `/User/GetPurchaseBySt?userID=${userId}&${statusesParam}`;
    const response = await baseRequest.get(url);
    return response.data.result;
  } catch (error) {
    if (error.response) {
      // Lỗi từ phía server, ví dụ: status code không phải 2xx
      console.error('Lỗi từ server:', error.response.status, error.response.data);
    } else if (error.request) {
      // Không nhận được phản hồi từ server
      console.error('Không kết nối được tới server:', error.request);
    } else {
      // Lỗi khác
      console.error('Lỗi:', error.message);
    }
    return null;
  }
};

// UPDATE STATUS
export const updatePurchaseStatus = async (purDTO) => {
  try {
    const response = await baseRequest.put(`/User/EditPurChase`, purDTO);
    return response.data.result;
  } catch (error) {
    if (error.response) {
      // Lỗi từ phía server, ví dụ: status code không phải 2xx
      console.error('Lỗi từ server:', error.response.status, error.response.data);
    } else if (error.request) {
      // Không nhận được phản hồi từ server
      console.error('Không kết nối được tới server:', error.request);
    } else {
      // Lỗi khác
      console.error('Lỗi:', error.message);
    }

    // Trả về một giá trị mà bạn xác định để xử lý lỗi tại nơi gọi hàm này
    return null;
  }
};

// GET DELIVERI BYID
export const getDeliveryById = async (id) => {
  try {
    const response = await baseRequest.get(`/User/DeliveryById?id=${id}`);
    return response.data.result;
  } catch (error) {
    // Bắt lỗi và xử lý tại đây
    if (error.response) {
      // Lỗi từ phía server, ví dụ: status code không phải 2xx
      console.error('Lỗi từ server:', error.response.status, error.response.data);
    } else if (error.request) {
      // Không nhận được phản hồi từ server
      console.error('Không kết nối được tới server:', error.request);
    } else {
      // Lỗi khác
      console.error('Lỗi:', error.message);
    }

    // Trả về một giá trị mà bạn xác định để xử lý lỗi tại nơi gọi hàm này
    return null; // Hoặc throw một exception
  }
};

export const deleteFolder = async (id) => {
  try {
    const response = await baseRequest.delete(`/cart/deleteFolder?purchaseID=${id}`);
    return response.data.result;
  } catch (error) {
    if (error.response) {
      // Lỗi từ phía server, ví dụ: status code không phải 2xx
      console.error('Lỗi từ server:', error.response.status, error.response.data);
    } else if (error.request) {
      // Không nhận được phản hồi từ server
      console.error('Không kết nối được tới server:', error.request);
    } else {
      // Lỗi khác
      console.error('Lỗi:', error.message);
    }

    // Trả về một giá trị mà bạn xác định để xử lý lỗi tại nơi gọi hàm này
    return null;
  }
};
