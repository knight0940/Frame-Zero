import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async findAll(isActive = true) {
    const where = isActive ? { isActive: true } : {};

    const boards = await this.prisma.board.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    // Get check-in count for check-in board
    const checkInBoard = boards.find((b) => b.slug === 'check-in');
    let checkInCount = 0;
    if (checkInBoard) {
      checkInCount = await this.prisma.checkIn.count();
    }

    // Transform postsCount to each board
    return boards.map((board) => {
      // For check-in board, use check-in count instead of posts count
      if (board.slug === 'check-in') {
        return {
          ...board,
          postsCount: checkInCount,
        };
      }
      return {
        ...board,
        postsCount: board._count.posts,
      };
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.board.findUnique({
      where: { slug },
    });
  }
}
