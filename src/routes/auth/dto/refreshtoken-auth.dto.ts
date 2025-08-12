import { IsString } from 'class-validator'
import { LoginResDto } from 'src/routes/auth/dto/login-auth.dto'

export class RefreshTokenBody {
  @IsString()
  token: string
}

export class RefreshTokenBodyResDto extends LoginResDto {}
export class LogoutAuthDto extends RefreshTokenBody {}
export class LogoutResDto {
  message: string
  constructor(partial: Partial<LogoutResDto>) {
    Object.assign(this, partial)
  }
}
