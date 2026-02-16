import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import {
  UserResponse,
  UserProfileResponse,
  UserStatsResponse,
} from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<UserProfileResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const stats = await this.getStats(id);

    return {
      ...this.toUserResponse(user),
      statistics: stats,
    };
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async updateProfile(
    userId: string,
    dto: UpdateUserDto,
  ): Promise<UserResponse> {
    // Check username uniqueness if being updated
    if (dto.username) {
      const existing = await this.prisma.user.findFirst({
        where: {
          username: dto.username,
          NOT: { id: userId },
        },
      });

      if (existing) {
        throw new BadRequestException('Username already taken');
      }
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });

    return this.toUserResponse(user);
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Import auth service for password comparison
    const { AuthService } = await import('../auth/auth.service');
    const authService = new AuthService(
      this.prisma,
      null as any, // jwtService - not needed for password comparison
      null as any, // configService - not needed
    );

    const isPasswordValid = await authService.comparePasswords(
      dto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await authService.generateHash(dto.newPassword);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Invalidate all sessions for security
    await this.prisma.session.deleteMany({
      where: { userId },
    });

    return { message: 'Password updated successfully' };
  }

  async getStats(userId: string): Promise<UserStatsResponse> {
    const [postsCount, commentsCount, likesReceived, checkIns] =
      await Promise.all([
        this.prisma.post.count({ where: { authorId: userId } }),
        this.prisma.comment.count({ where: { authorId: userId } }),
        this.prisma.like.count({ where: { userId } }),
        this.prisma.checkIn.findMany({
          where: { userId },
          orderBy: { checkInDate: 'desc' },
        }),
      ]);

    // Calculate consecutive check-in days (using UTC to avoid timezone issues)
    let consecutiveCheckInDays = 0;
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));

    for (let i = 0; i < checkIns.length; i++) {
      const checkInDate = new Date(checkIns[i].checkInDate);
      const checkInDateUtc = new Date(Date.UTC(checkInDate.getUTCFullYear(), checkInDate.getUTCMonth(), checkInDate.getUTCDate(), 0, 0, 0, 0));

      const expectedDate = new Date(today);
      expectedDate.setUTCDate(expectedDate.getUTCDate() - i);

      if (checkInDateUtc.getTime() === expectedDate.getTime()) {
        consecutiveCheckInDays++;
      } else {
        break;
      }
    }

    return {
      postsCount,
      commentsCount,
      likesReceived,
      checkInDays: checkIns.length,
      consecutiveCheckInDays,
    };
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
