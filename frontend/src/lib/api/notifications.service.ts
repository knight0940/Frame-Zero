import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';
import { Notification } from './types';

// 获取通知列表
export const getNotifications = async (
  page = 1,
  limit = 20
): Promise<{ data: Notification[]; meta: { total: number; totalPages: number; page: number; limit: number } }> => {
  const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.LIST, {
    params: { page, limit },
  });
  return response.data;
};

// 获取未读通知数量
export const getUnreadCount = async (): Promise<{ count: number }> => {
  const response = await apiClient.get<{ data: { count: number } }>(
    API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT
  );
  return response.data.data;
};

// 标记通知为已读
export const markAsRead = async (id: string): Promise<Notification> => {
  const response = await apiClient.patch<{ data: Notification }>(
    `${API_ENDPOINTS.NOTIFICATIONS.LIST}/${id}/read`
  );
  return response.data.data;
};

// 标记所有通知为已读
export const markAllAsRead = async (): Promise<{ message: string }> => {
  const response = await apiClient.patch<{ data: { message: string } }>(
    `${API_ENDPOINTS.NOTIFICATIONS.LIST}/mark-all-read`
  );
  return response.data.data;
};

// 删除通知
export const deleteNotification = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ data: { message: string } }>(
    `${API_ENDPOINTS.NOTIFICATIONS.LIST}/${id}`
  );
  return response.data.data;
};
