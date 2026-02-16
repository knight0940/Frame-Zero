// 用户类型
export interface User {
  id: string;
  email: string;
  username: string;
  role: 'FOUNDER' | 'ADMIN' | 'USER';
  avatar: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

// Token 类型
export interface Tokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// 认证响应
export interface AuthResponse {
  user: User;
  tokens: Tokens;
}

// 注册 DTO
export interface RegisterDto {
  email: string;
  username: string;
  password: string;
}

// 登录 DTO
export interface LoginDto {
  email: string;
  password: string;
}

// 刷新 Token DTO
export interface RefreshTokensDto {
  refreshToken: string;
}

// 更新用户 DTO
export interface UpdateUserDto {
  username?: string;
  bio?: string;
  avatar?: string;
}

// 修改密码 DTO
export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// 用户统计
export interface UserStats {
  postsCount: number;
  commentsCount: number;
  likesReceived: number;
  checkInDays: number;
  consecutiveCheckInDays: number;
}

// 用户资料响应
export interface UserProfileResponse extends User {
  statistics?: UserStats;
}

// API 响应格式
export interface ApiResponse<T = any> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    [key: string]: any;
  };
}

// API 错误格式
export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// 板块类型
export interface Board {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  order: number;
  isActive: boolean;
  postsCount?: number;
  createdAt: string;
  updatedAt: string;
}

// 打卡类型
export interface CheckIn {
  id: string;
  userId: string;
  content: string | null;
  studyHours: number;
  learnings: any;
  checkInDate: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    username: string;
  };
}

// 打卡 DTO
export interface CreateCheckInDto {
  content?: string;
  studyHours: number;
  learnings?: string[];
}

// 打卡统计
export interface CheckInStats {
  today: CheckIn | null;
  consecutiveDays: number;
  totalDays: number;
}

// 帖子类型
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  boardId: string;
  authorId: string;
  status: string;
  isPinned: boolean;
  isLocked: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    username: string;
    avatar: string | null;
  };
  board?: {
    id: string;
    slug: string;
    name: string;
    icon: string | null;
  };
}

// 创建帖子 DTO
export interface CreatePostDto {
  title: string;
  content: string;
  excerpt?: string;
  boardId: string;
  coverImage?: string;
}

// 更新帖子 DTO
export interface UpdatePostDto {
  title?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
}

// 评论类型
export interface Comment {
  id: string;
  authorId: string;
  postId: string;
  content: string | null;
  parentId: string | null;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  author?: {
    id: string;
    username: string;
    avatar: string | null;
    bio?: string;
  };
  replies?: Comment[];
  post?: {
    id: string;
    title: string;
    slug: string;
  };
}

// 创建评论 DTO
export interface CreateCommentDto {
  postId: string;
  content?: string;
  parentId?: string;
}

// 更新评论 DTO
export interface UpdateCommentDto {
  content?: string;
}

// 点赞 DTO
export interface ToggleLikeDto {
  postId: string;
}

// 通知类型
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  content: string;
  relatedId: string | null;
  relatedType: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
