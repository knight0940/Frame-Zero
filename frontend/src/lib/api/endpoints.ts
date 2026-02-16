export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  // 认证
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
  },

  // 用户
  USERS: {
    PROFILE: (id: string) => `${API_BASE_URL}/users/${id}`,
    MY_STATS: `${API_BASE_URL}/users/me/stats`,
    UPDATE_ME: `${API_BASE_URL}/users/me`,
    CHANGE_PASSWORD: `${API_BASE_URL}/users/me/password`,
  },

  // 板块
  BOARDS: {
    LIST: `${API_BASE_URL}/boards`,
    BY_SLUG: (slug: string) => `${API_BASE_URL}/boards/${slug}`,
  },

  // 帖子
  POSTS: {
    LIST: `${API_BASE_URL}/posts`,
    BY_ID: (id: string) => `${API_BASE_URL}/posts/${id}`,
  },

  // 打卡
  CHECK_INS: {
    LIST: `${API_BASE_URL}/check-ins`,
    MY_HISTORY: `${API_BASE_URL}/check-ins/my`,
    TODAY: `${API_BASE_URL}/check-ins/today`,
    LEADERBOARD: `${API_BASE_URL}/check-ins/leaderboard`,
  },

  // 评论
  COMMENTS: {
    LIST: `${API_BASE_URL}/comments`,
    BY_ID: (id: string) => `${API_BASE_URL}/comments/${id}`,
  },

  // 点赞
  LIKES: {
    LIST: `${API_BASE_URL}/likes`,
    TOGGLE: `${API_BASE_URL}/likes/toggle`,
    CHECK: `${API_BASE_URL}/likes/check`,
  },

  // 通知
  NOTIFICATIONS: {
    LIST: `${API_BASE_URL}/notifications`,
    UNREAD_COUNT: `${API_BASE_URL}/notifications/unread-count`,
  },
} as const;
