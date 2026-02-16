import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: '用户名至少3个字符' })
  @MaxLength(20, { message: '用户名最多20个字符' })
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: '个人简介最多500字' })
  bio?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
