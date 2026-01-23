// ==================== 用户相关 ====================

export enum Role {
  FOUNDER = 'FOUNDER',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
  DELETED = 'DELETED',
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  role: Role;
  status: UserStatus;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  postsCount: number;
  commentsCount: number;
  likesCount: number;
  checkInDays: number;
}

// ==================== 认证相关 ====================

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

// ==================== 板块相关 ====================

export interface Board {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  postsCount?: number;
}

// ==================== 帖子相关 ====================

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  slug?: string;
  boardId: string;
  authorId: string;
  status: PostStatus;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  board?: Board;
  author?: User;
  isLiked?: boolean;
}

export interface CreatePostDto {
  title: string;
  content: string;
  boardId: string;
  excerpt?: string;
  coverImage?: string;
  status?: PostStatus;
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  status?: PostStatus;
}

export interface PostQueryDto {
  page?: number;
  limit?: number;
  boardId?: string;
  search?: string;
  sort?: 'latest' | 'popular' | 'mostLiked' | 'mostCommented';
}

// ==================== 评论相关 ====================

export interface Comment {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  parentId?: string;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
  author?: User;
  replies?: Comment[];
}

export interface CreateCommentDto {
  content: string;
  parentId?: string;
}

export interface UpdateCommentDto {
  content: string;
}

// ==================== 打卡相关 ====================

export interface CheckIn {
  id: string;
  userId: string;
  content?: string;
  studyHours: number;
  learnings: string[];
  checkInDate: Date;
  consecutiveDays?: number;
  totalDays?: number;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface CreateCheckInDto {
  content?: string;
  studyHours: number;
  learnings: string[];
}

// ==================== 通知相关 ====================

export enum NotificationType {
  COMMENT = 'COMMENT',
  REPLY = 'REPLY',
  LIKE = 'LIKE',
  MENTION = 'MENTION',
  SYSTEM = 'SYSTEM',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

// ==================== 通用类型 ====================

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  value: number;
  valueLabel: string;
}
