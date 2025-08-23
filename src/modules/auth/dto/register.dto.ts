import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Nguyen Van A',
    description: 'Tên người dùng',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email đăng ký (unique)',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'secret123',
    minLength: 6,
    description: 'Mật khẩu có ít nhất 6 ký tự',
  })
  @MinLength(6)
  password: string;
}
