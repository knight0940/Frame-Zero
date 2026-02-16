import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CheckInsService } from './check-ins.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserInfo } from '../common/decorators/current-user.decorator';
import { CreateCheckInDto } from './dto/create-checkin.dto';

@Controller('check-ins')
export class CheckInsController {
  constructor(private readonly checkInsService: CheckInsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getHistory(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.checkInsService.getHistory(page, limit);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  getMyHistory(@CurrentUser() user: UserInfo, @Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.checkInsService.getMyHistory(user.id, page, limit);
  }

  @Get('today')
  @UseGuards(JwtAuthGuard)
  getToday(@CurrentUser() user: UserInfo) {
    return this.checkInsService.getToday(user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCheckInDto: CreateCheckInDto, @CurrentUser() user: UserInfo) {
    return this.checkInsService.create(user.id, createCheckInDto);
  }

  @Get('leaderboard')
  getLeaderboard() {
    return this.checkInsService.getLeaderboard();
  }
}
