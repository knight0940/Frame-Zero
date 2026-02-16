import { User } from '@prisma/client';

export class TokensResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthResponse {
  user: UserResponse;
  tokens: TokensResponse;
}

export class UserResponse {
  id: string;
  email: string;
  username: string;
  role: string;
  avatar: string | null;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
