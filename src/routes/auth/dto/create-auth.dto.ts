import { IsNotEmpty, IsString } from 'class-validator'
import { LoginAuthDto } from 'src/routes/auth/dto/login-auth.dto'
import { Match } from 'src/shared/decorators/custom-validator.decorator'

export class CreateAuthDto extends LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  name: string
  @IsString()
  @IsNotEmpty()
  @Match('password', { message: 'Mật khẩu không khớp' })
  confirmPassword: string
}
