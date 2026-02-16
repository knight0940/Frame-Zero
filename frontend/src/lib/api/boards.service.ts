import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';
import { Board } from './types';

// 获取所有板块
export const getBoards = async (isActive = true): Promise<Board[]> => {
  const response = await apiClient.get<{ data: Board[] }>(
    API_ENDPOINTS.BOARDS.LIST,
    {
      params: isActive !== undefined ? { isActive } : undefined,
    }
  );
  return response.data.data;
};

// 获取单个板块
export const getBoardBySlug = async (slug: string): Promise<Board> => {
  const response = await apiClient.get<{ data: Board }>(
    API_ENDPOINTS.BOARDS.BY_SLUG(slug)
  );
  return response.data.data;
};
