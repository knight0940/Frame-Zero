import { Controller, Get, Patch, Delete, Param, UseGuards, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserInfo } from '../common/decorators/current-user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@CurrentUser() user: UserInfo, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.notificationsService.findAll(user.id, page, limit);
  }

  @Get('unread-count')
  getUnreadCount(@CurrentUser() user: UserInfo) {
    return this.notificationsService.getUnreadCount(user.id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @CurrentUser() user: UserInfo) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Patch('mark-all-read')
  markAllAsRead(@CurrentUser() user: UserInfo) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: UserInfo) {
    return this.notificationsService.delete(id, user.id);
  }
}
