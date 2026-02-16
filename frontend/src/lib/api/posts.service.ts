import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';
import { Post } from './types';

// 获取帖子列表
export const getPosts = async (params?: {
  boardId?: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ data: Post[]; meta: { total: number; page: number; limit: number; totalPages: number } }> => {
  const response = await apiClient.get(API_ENDPOINTS.POSTS.LIST, { params });
  return response.data;
};

// 获取单个帖子
export const getPostById = async (id: string): Promise<Post> => {
  const response = await apiClient.get<{ data: Post }>(
    API_ENDPOINTS.POSTS.BY_ID(id)
  );
  return response.data.data;
};

// 创建帖子
export const createPost = async (data: {
  title: string;
  content: string;
  boardId: string;
  excerpt?: string;
  coverImage?: string;
}): Promise<Post> => {
  const response = await apiClient.post<{ data: Post }>(
    API_ENDPOINTS.POSTS.LIST,
    data
  );
  return response.data.data;
};

// 更新帖子
export const updatePost = async (
  id: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
  }
): Promise<Post> => {
  const response = await apiClient.patch<{ data: Post }>(
    API_ENDPOINTS.POSTS.BY_ID(id),
    data
  );
  return response.data.data;
};

// 删除帖子
export const deletePost = async (id: string): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.POSTS.BY_ID(id));
};
