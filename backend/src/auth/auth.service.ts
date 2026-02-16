import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { authConfig } from '../config/auth.config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokensResponse, UserResponse } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if email already exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check if username already exists
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const hashedPassword = await this.generateHash(dto.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        password: hashedPassword,
        role: 'USER',
      },
    });

    // Log activity
    await this.prisma.activity.create({
      data: {
        userId: user.id,
        type: 'REGISTER',
        description: 'User registered',
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    // Create session
    await this.createSession(user.id, tokens.refreshToken, tokens.accessToken);

    return {
      user: this.toUserResponse(user),
      tokens,
    };
  }

  async login(dto: LoginDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await this.comparePasswords(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    // Create session
    await this.createSession(user.id, tokens.refreshToken, tokens.accessToken);

    // Log activity
    await this.prisma.activity.create({
      data: {
        userId: user.id,
        type: 'LOGIN',
        description: 'User logged in',
      },
    });

    return {
      user: this.toUserResponse(user),
      tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Find session
      const session = await this.prisma.session.findFirst({
        where: {
          userId: payload.sub,
          refreshToken: payload.sessionId,
          expiresAt: { gt: new Date() },
        },
        include: { user: true },
      });

      if (!session || !session.user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (session.user.status !== 'ACTIVE') {
        throw new UnauthorizedException('Account is not active');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(session.user.id);

      // Update session with new refresh token
      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          refreshToken: tokens.refreshToken,
          expiresAt: new Date(
            Date.now() + authConfig.refreshTokenExpiration * 1000,
          ),
        },
      });

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string, refreshToken?: string) {
    // Delete session if refresh token provided
    if (refreshToken) {
      await this.prisma.session.deleteMany({
        where: {
          userId,
          refreshToken,
        },
      });
    } else {
      // Delete all sessions for user
      await this.prisma.session.deleteMany({
        where: { userId },
      });
    }

    // Log activity
    await this.prisma.activity.create({
      data: {
        userId,
        type: 'LOGOUT',
        description: 'User logged out',
      },
    });

    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return this.toUserResponse(user);
  }

  private async generateTokens(userId: string): Promise<TokensResponse> {
    const sessionId = crypto.randomUUID();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          type: 'access',
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: authConfig.accessTokenExpiration,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          type: 'refresh',
          sessionId,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: authConfig.refreshTokenExpiration,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: authConfig.accessTokenExpiration,
    };
  }

  private async createSession(userId: string, refreshToken: string, token: string) {
    await this.prisma.session.create({
      data: {
        userId,
        token,
        refreshToken,
        expiresAt: new Date(
          Date.now() + authConfig.refreshTokenExpiration * 1000,
        ),
      },
    });
  }

  async generateHash(password: string): Promise<string> {
    return bcrypt.hash(password, authConfig.bcryptSaltRounds);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private toUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
