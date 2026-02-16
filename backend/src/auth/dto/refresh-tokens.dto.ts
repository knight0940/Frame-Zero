import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokensDto {
  @IsString({ message: 'Refresh token 必须是字符串' })
  @IsNotEmpty({ message: 'Refresh token 不能为空' })
  refreshToken: string;
}
