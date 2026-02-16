import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createCommentDto: CreateCommentDto) {
    // Verify post exists
    const post = await this.prisma.post.findUnique({
      where: { id: createCommentDto.postId },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // If it's a reply, verify parent comment exists
    if (createCommentDto.parentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: createCommentDto.parentId },
      });

      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }

      if (parentComment.postId !== createCommentDto.postId) {
        throw new ForbiddenException('Parent comment does not belong to this post');
      }
    }

    const comment = await this.prisma.comment.create({
      data: {
        authorId: userId,
        postId: createCommentDto.postId,
        content: createCommentDto.content || null,
        parentId: createCommentDto.parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    // Update post comment count
    await this.prisma.post.update({
      where: { id: createCommentDto.postId },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });

    // TODO: Create notification using data field

    return comment;
  }

  async findAll(postId?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const where = postId ? { postId } : {};
    const whereWithParentNull = postId ? { postId, parentId: null } : { parentId: null };

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: whereWithParentNull,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  avatar: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.comment.count({ where }),
    ]);

    return {
      data: comments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
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
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async update(id: string, userId: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check ownership
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (comment.authorId !== userId && user?.role !== 'ADMIN' && user?.role !== 'FOUNDER') {
      throw new ForbiddenException('You can only update your own comments');
    }

    return this.prisma.comment.update({
      where: { id },
      data: {
        content: updateCommentDto.content,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check ownership
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (comment.authorId !== userId && user?.role !== 'ADMIN' && user?.role !== 'FOUNDER') {
      throw new ForbiddenException('You can only delete your own comments');
    }

    // Delete comment (cascade will delete replies)
    await this.prisma.comment.delete({
      where: { id },
    });

    // Update post comment count
    const replyCount = await this.prisma.comment.count({
      where: { parentId: id },
    });

    await this.prisma.post.update({
      where: { id: comment.postId },
      data: {
        commentCount: {
          decrement: 1 + replyCount,
        },
      },
    });

    return { message: 'Comment deleted successfully' };
  }
}
