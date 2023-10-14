import axios from "axios";

export const getAllUsers = async (search, st, page, pageSize) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/User/GetAll`,
      {
        params: {
          search,
          st,
          page,
          pageSize,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getUserById = async (id) => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_BASE_URL}/User/${id}`
  );
  return data;
};

export const updateUser = async (userDTO) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/User/Edit`,
      userDTO // Truyền dữ liệu cần cập nhật từ userDTO
    );

    if (response.status === 200) {
      // Xử lý nếu API trả về mã 200 OK
      return response;
    } 
      // Xử lý nếu có lỗi
      throw new Error("Failed to update user");
  } catch (error) {
    // Xử lý nếu có lỗi mạng hoặc lỗi từ server
    throw new Error(error.message);
  }
};

export const changePassword = async (userDTO) => {
  const response = await axios.put(
    `${process.env.REACT_APP_API_BASE_URL}/User/ChangePass`,
    userDTO // Truyền requestData chứa cả userDTO, oldPassword, và newPassword
  );

  return response;
};

export const deleteUser = async (id) => {
  const { data } = await axios.delete(
    `${process.env.REACT_APP_API_BASE_URL}/users/${id}`
  );
  return data;
};

export const addFavorite = async (id, productId) => {
  const { data } = await axios.post(
    `${process.env.REACT_APP_API_BASE_URL}/users/${id}/favorite/${productId}`
  );
  return data;
};

export const deleteFavorite = async (id, productId) => {
  const { data } = await axios.delete(
    `${process.env.REACT_APP_API_BASE_URL}/users/${id}/favorite/${productId}`
  );
  return data;
};
