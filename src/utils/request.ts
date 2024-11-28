import axios from 'axios';
import { message } from 'antd';
import { store } from '../store';
import { clearWorkspaceState } from '../store/slices/workspaceSlice';
import { clearAuth } from '../store/slices/authSlice';

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

      // 处理token失效的情况
      if (status === 401) {
        message.error('登录已过期，请重新登录');
        // 清除本地存储和状态
        localStorage.clear();
        store.dispatch(clearWorkspaceState());
        store.dispatch(clearAuth());
        // 重定向到登录页
        window.location.href = '/login';
        return Promise.reject(new Error('未授权'));
      }

      message.error(data.message || '请求失败');
    } else {
      message.error('网络错误');
    }
    return Promise.reject(error);
  }
);

export default request;
