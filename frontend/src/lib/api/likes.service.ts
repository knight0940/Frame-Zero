import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

// 切换点赞/取消点赞
export const toggleLike = async (postId: string): Promise<{ liked: boolean }> => {
  const response = await apiClient.post<{ data: { liked: boolean } }>(
    API_ENDPOINTS.LIKES.TOGGLE,
    { postId }
  );
  return response.data.data;
};

// 检查用户是否已点赞
export const checkUserLike = async (postId: string): Promise<{ liked: boolean }> => {
  const response = await apiClient.get<{ data: { liked: boolean } }>(
    API_ENDPOINTS.LIKES.CHECK,
    { params: { postId } }
  );
  return response.data.data;
};

// 获取点赞列表
export const getLikesByPost = async (
  postId: string,
  page = 1,
  limit = 20
): Promise<{ data: any[]; meta: { total: number; totalPages: number; page: number; limit: number } }> => {
  const response = await apiClient.get(API_ENDPOINTS.LIKES.LIST, {
    params: { postId, page, limit },
  });
  return response.data;
};
