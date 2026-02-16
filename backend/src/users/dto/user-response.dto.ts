export class UserResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class UserStatsResponse {
  postsCount: number;
  commentsCount: number;
  likesReceived: number;
  checkInDays: number;
  consecutiveCheckInDays: number;
}

export class UserProfileResponse extends UserResponse {
  statistics?: UserStatsResponse;
}
