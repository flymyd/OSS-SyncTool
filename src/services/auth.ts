import request from '../utils/request';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  userId: number;
}

export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}

export const login = async (values: { username: string; password: string }) => {
  try {
    const response = await request.post('/user/login', values)
    console.log(response)
    // 保存用户信息到本地存储
    localStorage.setItem('token', response.token)
    localStorage.setItem('userId', response.userId)
    localStorage.setItem('username', response.username)
    localStorage.setItem('currentWorkspace', '新工作区')
    return response
  } catch (error) {
    throw error
  }
}

export const register = (data: LoginParams) => {
  return request.post('/user/register', data);
};

export const changePassword = (data: ChangePasswordParams) => {
  return request.post('/user/change-password', data);
}; 