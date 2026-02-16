import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleLikeDto {
  @ApiProperty({ description: 'Post ID to like/unlike' })
  @IsString()
  @IsNotEmpty()
  postId: string;
}
