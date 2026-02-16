import { IsString, IsNotEmpty, IsOptional, MinLength, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'Post ID' })
  @IsString()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({ description: 'Comment content', required: false })
  @IsString()
  @IsOptional()
  @MinLength(1)
  content?: string;

  @ApiProperty({ description: 'Parent comment ID for nested comments', required: false })
  @IsString()
  @IsOptional()
  parentId?: string;
}
