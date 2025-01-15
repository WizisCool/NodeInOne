import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // 从 .env 文件中获取后端地址
  withCredentials: true, // 如果需要传递 Cookies
});

export default apiClient;
