import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    boardId?: string;
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const { boardId, page = 1, limit = 20, search } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (boardId) {
      where.boardId = boardId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          board: {
            select: {
              id: true,
              slug: true,
              name: true,
              icon: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
            bio: true,
          },
        },
        board: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Increment view count
    await this.prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return post;
  }

  async create(userId: string, createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId: userId,
        slug: this.generateSlug(createPostDto.title),
        status: 'PUBLISHED',
      },
    });
  }

  async update(id: string, userId: string, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check ownership or admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (post.authorId !== userId && user?.role !== 'ADMIN' && user?.role !== 'FOUNDER') {
      throw new ForbiddenException('You can only update your own posts');
    }

    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async remove(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check ownership or admin
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (post.authorId !== userId && user?.role !== 'ADMIN' && user?.role !== 'FOUNDER') {
      throw new ForbiddenException('You can only delete your own posts');
    }

    await this.prisma.post.delete({ where: { id } });
  }

  private generateSlug(title: string): string {
    const timestamp = Date.now().toString(36);
    return `${title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50)}-${timestamp}`;
  }
}
