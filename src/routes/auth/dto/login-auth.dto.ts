import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string
}
export class LoginResDto {
  accessToken: string
  refreshToken: string
  constructor(partial: Partial<LoginResDto>) {
    Object.assign(this, partial)
  }
}
