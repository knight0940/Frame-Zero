import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserInfo } from '../common/decorators/current-user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll(
    @Query('postId') postId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.commentsService.findAll(postId, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @CurrentUser() user: UserInfo) {
    return this.commentsService.create(user.id, createCommentDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: UserInfo,
  ) {
    return this.commentsService.update(id, user.id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: UserInfo) {
    return this.commentsService.remove(id, user.id);
  }
}
