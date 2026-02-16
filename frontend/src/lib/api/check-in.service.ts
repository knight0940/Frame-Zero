import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';
import {
  CreateCheckInDto,
  CheckIn,
  CheckInStats,
} from './types';

// 创建打卡
export const createCheckIn = async (
  data: CreateCheckInDto
): Promise<CheckIn> => {
  const response = await apiClient.post<{ data: CheckIn }>(
    API_ENDPOINTS.CHECK_INS.LIST,
    data
  );
  return response.data.data;
};

// 获取今日打卡
export const getTodayCheckIn = async (): Promise<CheckIn | null> => {
  try {
    const response = await apiClient.get<{ data: CheckIn }>(
      API_ENDPOINTS.CHECK_INS.TODAY
    );
    return response.data.data;
  } catch (error) {
    return null;
  }
};

// 获取打卡历史（所有人的）
export const getCheckInHistory = async (
  page = 1,
  limit = 20
): Promise<{ data: CheckIn[]; meta: { total: number; totalPages: number } }> => {
  const response = await apiClient.get(API_ENDPOINTS.CHECK_INS.LIST, {
    params: { page, limit },
  });
  return response.data;
};

// 获取我的打卡历史
export const getMyCheckInHistory = async (
  page = 1,
  limit = 20
): Promise<{ data: CheckIn[]; meta: { total: number; totalPages: number } }> => {
  const response = await apiClient.get(API_ENDPOINTS.CHECK_INS.MY_HISTORY, {
    params: { page, limit },
  });
  return response.data;
};

// 获取排行榜
export const getLeaderboard = async (): Promise<
  Array<{ user: { username: string }; consecutiveDays: number }>
> => {
  const response = await apiClient.get(API_ENDPOINTS.CHECK_INS.LEADERBOARD);
  return response.data.data;
};
