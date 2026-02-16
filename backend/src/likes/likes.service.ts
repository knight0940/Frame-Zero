import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async toggle(userId: string, postId: string) {
    // Verify post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if already liked
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await this.prisma.like.delete({
        where: { id: existingLike.id },
      });

      // Update post like count
      await this.prisma.post.update({
        where: { id: postId },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      });

      return { liked: false };
    } else {
      // Like
      const like = await this.prisma.like.create({
        data: {
          userId,
          postId,
        },
      });

      // Update post like count
      await this.prisma.post.update({
        where: { id: postId },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      });

      // Create notification for post author
      if (post.authorId !== userId) {
        await this.prisma.notification.create({
          data: {
            userId: post.authorId,
            type: 'LIKE',
            title: '新点赞',
            content: '有人赞了你的帖子',
            data: {
              likeId: like.id,
              postId: postId,
            },
          },
        });
      }

      return { liked: true };
    }
  }

  async checkUserLike(userId: string, postId: string) {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return { liked: !!like };
  }

  async getLikesByPost(postId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [likes, total] = await Promise.all([
      this.prisma.like.findMany({
        where: {
          postId,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.like.count({
        where: {
          postId,
        },
      }),
    ]);

    return {
      data: likes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
