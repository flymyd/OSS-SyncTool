import axios from 'axios';
import { message } from 'antd';
import { store } from '../store';
import { clearWorkspaceState } from '../store/slices/workspaceSlice';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8965',
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
  response => response.data,
  error => {
    if (error.response) {
      const { status, data } = error.response;

      // 处理工作区不存在的情况
      if (status === 404 && data.message?.includes('工作区不存在')) {
        message.error('当前工作区不存在或已被删除');
        store.dispatch(clearWorkspaceState());
        window.location.href = '/dashboard/workspaces';
        return Promise.reject(new Error('工作区不存在'));
      }

      message.error(data.message || '请求失败');
    } else {
      message.error('网络错误');
    }
    return Promise.reject(error);
  }
);

export default request;
