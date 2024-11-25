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

export const login = (data: LoginParams): Promise<LoginResponse> => {
  return request.post('/user/login', data);
};

export const register = (data: LoginParams) => {
  return request.post('/user/register', data);
};

export const changePassword = (data: ChangePasswordParams) => {
  return request.post('/user/change-password', data);
}; 