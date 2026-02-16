import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';
import {
  UpdateUserDto,
  ChangePasswordDto,
  UserProfileResponse,
  User,
  UserStats,
} from './types';

// 获取用户资料
export const getUserProfile = async (userId: string): Promise<UserProfileResponse> => {
  const response = await apiClient.get<{ data: UserProfileResponse }>(
    API_ENDPOINTS.USERS.PROFILE(userId)
  );
  return response.data.data;
};

// 获取当前用户统计
export const getMyStats = async (): Promise<UserStats> => {
  const response = await apiClient.get<{ data: UserStats }>(
    API_ENDPOINTS.USERS.MY_STATS
  );
  return response.data.data;
};

// 更新当前用户资料
export const updateMyProfile = async (
  data: UpdateUserDto
): Promise<User> => {
  const response = await apiClient.patch<{ data: User }>(
    API_ENDPOINTS.USERS.UPDATE_ME,
    data
  );
  return response.data.data;
};

// 修改密码
export const changePassword = async (
  data: ChangePasswordDto
): Promise<{ message: string }> => {
  const response = await apiClient.patch<{ data: { message: string } }>(
    API_ENDPOINTS.USERS.CHANGE_PASSWORD,
    data
  );
  return response.data.data;
};
