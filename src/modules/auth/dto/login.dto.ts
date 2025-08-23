import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email đã đăng ký',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'secret123',
    minLength: 6,
    description: 'Mật khẩu',
  })
  @MinLength(6)
  password: string;
}
