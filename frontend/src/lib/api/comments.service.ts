import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';
import { Comment, CreateCommentDto, UpdateCommentDto } from './types';

// 创建评论
export const createComment = async (data: CreateCommentDto): Promise<Comment> => {
  const response = await apiClient.post<{ data: Comment }>(
    API_ENDPOINTS.COMMENTS.LIST,
    data
  );
  return response.data.data;
};

// 获取评论列表
export const getComments = async (
  postId?: string,
  page = 1,
  limit = 20
): Promise<{ data: Comment[]; meta: { total: number; totalPages: number; page: number; limit: number } }> => {
  const response = await apiClient.get(API_ENDPOINTS.COMMENTS.LIST, {
    params: { postId, page, limit },
  });
  return response.data;
};

// 获取单个评论详情
export const getComment = async (id: string): Promise<Comment> => {
  const response = await apiClient.get<{ data: Comment }>(
    `${API_ENDPOINTS.COMMENTS.LIST}/${id}`
  );
  return response.data.data;
};

// 更新评论
export const updateComment = async (id: string, data: UpdateCommentDto): Promise<Comment> => {
  const response = await apiClient.patch<{ data: Comment }>(
    `${API_ENDPOINTS.COMMENTS.LIST}/${id}`,
    data
  );
  return response.data.data;
};

// 删除评论
export const deleteComment = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ data: { message: string } }>(
    `${API_ENDPOINTS.COMMENTS.LIST}/${id}`
  );
  return response.data.data;
};
