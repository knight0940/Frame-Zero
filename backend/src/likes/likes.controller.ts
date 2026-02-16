import { Controller, Post, Get, Body, UseGuards, Query } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserInfo } from '../common/decorators/current-user.decorator';
import { ToggleLikeDto } from './dto/toggle-like.dto';

@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('toggle')
  toggle(@Body() toggleLikeDto: ToggleLikeDto, @CurrentUser() user: UserInfo) {
    return this.likesService.toggle(user.id, toggleLikeDto.postId);
  }

  @Get('check')
  check(
    @CurrentUser() user: UserInfo,
    @Query('postId') postId: string,
  ) {
    return this.likesService.checkUserLike(user.id, postId);
  }

  @Get()
  findAll(
    @Query('postId') postId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.likesService.getLikesByPost(postId, page, limit);
  }
}
