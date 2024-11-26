import axios from 'axios';
import {message} from 'antd';

const request = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  baseURL: 'http://127.0.0.1:8965',
  timeout: 10000,
});

request.interceptors.request.use(
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

request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    message.error(error.response?.data?.message || '请求失败');
    return Promise.reject(error);
  }
);

export default request;
