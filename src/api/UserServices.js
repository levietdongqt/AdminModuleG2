import axios from 'axios';
import baseRequest from '../contexts/AxiosContext';

export const getAllUsers = async (search, st, page, pageSize) => {
  try {
    let response;
    if (search !== null && st === null) {
      response = await baseRequest.get(
        `${process.env.REACT_APP_API_BASE_URL}/User/GetAll?search=${search}&&page=${page}&&pageSize=${pageSize}`
      );
    } else {
      response = await baseRequest.get(
        `${process.env.REACT_APP_API_BASE_URL}/User/GetAll?page=${page}&&pageSize=${pageSize}`
      );
    }
    if(search !== null && st !== null){
      response = await baseRequest.get(
        `${process.env.REACT_APP_API_BASE_URL}/User/GetAll?search=${search}&&st=${st}&&page=${page}&&pageSize=${pageSize}`)
    }else if(search === null && st === null){
      response = await baseRequest.get(
        `${process.env.REACT_APP_API_BASE_URL}/User/GetAll?st=${st}&&page=${page}&&pageSize=${pageSize}`)
    }

    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getUserById = async (id) => {
  const { data } = await baseRequest.get(`${process.env.REACT_APP_API_BASE_URL}/User/${id}`);
  return data;
};

export const updateUser = async (addUserDTO) => {
  const response = await baseRequest.put(`${process.env.REACT_APP_API_BASE_URL}/User/ChangeStatus`, addUserDTO);

  // Xử lý nếu API trả về mã 200 OK
  return response; // Xử lý nếu có lỗi
};

export const changePassword = async (userDTO) => {
  const response = await baseRequest.put(
    `${process.env.REACT_APP_API_BASE_URL}/User/ChangePass`,
    userDTO // Truyền requestData chứa cả userDTO, oldPassword, và newPassword
  );

  return response;
};

export const deleteUser = async (id) => {
  const { data } = await baseRequest.delete(`${process.env.REACT_APP_API_BASE_URL}/users/${id}`);
  return data;
};

export const addFavorite = async (id, productId) => {
  const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/${id}/favorite/${productId}`);
  return data;
};

export const deleteFavorite = async (id, productId) => {
  const { data } = await baseRequest.delete(`${process.env.REACT_APP_API_BASE_URL}/users/${id}/favorite/${productId}`);
  return data;
};

export const TotalUsersInMonth = async () => {
  const response = await baseRequest.get(`${process.env.REACT_APP_API_BASE_URL}/user/Total`);
  return response;
};
