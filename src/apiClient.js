import axios from 'axios';
import Swal from 'sweetalert2';
import env from './env';

const apiClient = axios.create({
  baseURL: env.apiUrl
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 403) {
      console.error('BITCH fix api usage now!!!')
      Swal.fire({
        icon: 'error',
        title: 'fix api usage now!!!'
      })
      // Swal.fire({
      //   icon: 'error',
      //   title: 'Đã có người đăng nhập vào tài khoản này!'
      // }).then(() => {
      //   localStorage.clear();    
      //   const event = new Event('storage');
      //   window.dispatchEvent(event);
      //   window.location.href = '/#login';
      // })
    } else if (error.response) {
      Swal.fire({
        icon: 'warning',
        title: error.response?.data?.message || 'Thao tác dữ liệu thất bại!'
      })
    }
    return Promise.reject(error);
  }
);

export default apiClient;
