import { IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: '当前密码必须是字符串' })
  @MinLength(1, { message: '当前密码不能为空' })
  currentPassword: string;

  @IsString({ message: '新密码必须是字符串' })
  @MinLength(8, { message: '新密码至少8个字符' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: '新密码必须包含字母和数字',
  })
  newPassword: string;
}
