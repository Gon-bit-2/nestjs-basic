import { IsNotEmpty, IsString } from 'class-validator'

export class LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  email: string
  @IsString()
  @IsNotEmpty()
  password: string
}
export class LoginResDto {
  accessToken: string
  refreshToken: string
  constructor(partial: Partial<LoginResDto>) {
    Object.assign(this, partial)
  }
}
