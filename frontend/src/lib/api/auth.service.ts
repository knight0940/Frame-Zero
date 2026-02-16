import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';
import {
  RegisterDto,
  LoginDto,
  AuthResponse,
  RefreshTokensDto,
  User,
} from './types';

// 注册
export const register = async (data: RegisterDto): Promise<AuthResponse> => {
  const response = await apiClient.post<{ data: AuthResponse }>(
    API_ENDPOINTS.AUTH.REGISTER,
    data
  );
  return response.data.data;
};

// 登录
export const login = async (data: LoginDto): Promise<AuthResponse> => {
  const response = await apiClient.post<{ data: AuthResponse }>(
    API_ENDPOINTS.AUTH.LOGIN,
    data
  );
  return response.data.data;
};

// 刷新 token
export const refreshTokens = async (
  data: RefreshTokensDto
): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> => {
  const response = await apiClient.post<{
    data: { accessToken: string; refreshToken: string; expiresIn: number };
  }>(API_ENDPOINTS.AUTH.REFRESH, data);
  return response.data.data;
};

// 登出
export const logout = async (refreshToken?: string): Promise<{ message: string }> => {
  const response = await apiClient.post<{ data: { message: string } }>(
    API_ENDPOINTS.AUTH.LOGOUT,
    refreshToken ? { refreshToken } : {}
  );
  return response.data.data;
};

// 获取当前用户
export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get<{ data: User }>(API_ENDPOINTS.AUTH.ME);
  return response.data.data;
};
