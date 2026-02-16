import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckInDto } from './dto/create-checkin.dto';

@Injectable()
export class CheckInsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createCheckInDto: CreateCheckInDto) {
    // Create UTC midnight to avoid timezone issues
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));

    // Check if already checked in today
    const existing = await this.prisma.checkIn.findFirst({
      where: {
        userId,
        checkInDate: today,
      },
    });

    if (existing) {
      throw new ConflictException('Already checked in today');
    }

    // Create check-in
    const checkIn = await this.prisma.checkIn.create({
      data: {
        userId,
        content: createCheckInDto.content || null,
        studyHours: createCheckInDto.studyHours || 0,
        learnings: createCheckInDto.learnings || [],
        checkInDate: today,
      },
    });

    // Log activity
    await this.prisma.activity.create({
      data: {
        userId,
        type: 'CHECK_IN',
        description: 'User checked in',
      },
    });

    return checkIn;
  }

  async getToday(userId: string) {
    // Create UTC midnight to avoid timezone issues
    const now = new Date();
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));

    return this.prisma.checkIn.findFirst({
      where: {
        userId,
        checkInDate: today,
      },
    });
  }

  async getHistory(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [checkIns, total] = await Promise.all([
      this.prisma.checkIn.findMany({
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: { checkInDate: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.checkIn.count(),
    ]);

    // Transform user to author for frontend consistency
    const transformedCheckIns = checkIns.map((checkIn) => ({
      ...checkIn,
      author: checkIn.user,
      user: undefined,
    }));

    return {
      data: transformedCheckIns,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getMyHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [checkIns, total] = await Promise.all([
      this.prisma.checkIn.findMany({
        where: { userId },
        orderBy: { checkInDate: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.checkIn.count({ where: { userId } }),
    ]);

    return {
      data: checkIns,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getLeaderboard() {
    // Get consecutive check-in days for each user
    const users = await this.prisma.user.findMany({
      where: {
        status: 'ACTIVE',
      },
      select: {
        id: true,
        username: true,
      },
    });

    const leaderboard = await Promise.all(
      users.map(async (user) => {
        const checkIns = await this.prisma.checkIn.findMany({
          where: { userId: user.id },
          orderBy: { checkInDate: 'desc' },
          select: { checkInDate: true },
        });

        // Calculate consecutive days
        let consecutiveDays = 0;
        const now = new Date();
        const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));

        for (let i = 0; i < checkIns.length; i++) {
          const checkInDate = new Date(checkIns[i].checkInDate);
          const checkInDateUtc = new Date(Date.UTC(checkInDate.getUTCFullYear(), checkInDate.getUTCMonth(), checkInDate.getUTCDate(), 0, 0, 0, 0));

          const expectedDate = new Date(today);
          expectedDate.setUTCDate(expectedDate.getUTCDate() - i);

          if (checkInDateUtc.getTime() === expectedDate.getTime()) {
            consecutiveDays++;
          } else {
            break;
          }
        }

        return {
          user: {
            username: user.username,
          },
          consecutiveDays,
        };
      })
    );

    // Sort by consecutive days
    leaderboard.sort((a, b) => b.consecutiveDays - a.consecutiveDays);

    return leaderboard.slice(0, 10); // Top 10
  }
}
