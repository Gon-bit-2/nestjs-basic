import { IsString } from 'class-validator'
import { LoginResDto } from 'src/routes/auth/dto/login-auth.dto'

export class RefreshTokenBody {
  @IsString()
  token: string
}

export class RefreshTokenBodyResDto extends LoginResDto {}
