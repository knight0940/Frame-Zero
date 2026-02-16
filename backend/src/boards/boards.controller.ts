import { Controller, Get, Param } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Public()
  @Get()
  findAll() {
    return this.boardsService.findAll();
  }

  @Public()
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.boardsService.findBySlug(slug);
  }
}
