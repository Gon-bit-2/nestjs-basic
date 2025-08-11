import { IsNotEmpty, IsString } from 'class-validator'
import { LoginAuthDto } from 'src/routes/auth/dto/login-auth.dto'

export class CreateAuthDto extends LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  name: string
  @IsString()
  @IsNotEmpty()
  confirmPassword: string
}
