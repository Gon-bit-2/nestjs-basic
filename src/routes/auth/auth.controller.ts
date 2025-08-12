import { Controller, Post, Body, Delete, HttpCode, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateAuthDto } from './dto/create-auth.dto'
import { Auth } from 'src/routes/auth/entities/auth.entity'
import { LoginAuthDto, LoginResDto } from 'src/routes/auth/dto/login-auth.dto'
import {
  LogoutAuthDto,
  LogoutResDto,
  RefreshTokenBody,
  RefreshTokenBodyResDto,
} from 'src/routes/auth/dto/refreshtoken-auth.dto'
import { AccessTokenGuard } from 'src/shared/guard/access-token.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() createAuthDto: CreateAuthDto) {
    const result = await this.authService.register(createAuthDto)
    return new Auth(result)
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    const result = await this.authService.signIn(loginAuthDto)
    return new LoginResDto(result)
  }
  @Post('refresh-token')
  @HttpCode(200)
  @UseGuards(AccessTokenGuard)
  async refreshToken(@Body() refreshTokenBody: RefreshTokenBody) {
    const result = await this.authService.refreshToken(refreshTokenBody.token)
    return new RefreshTokenBodyResDto(result)
  }

  @Post('logout')
  async logout(@Body() logoutAuthDto: LogoutAuthDto) {
    const result = await this.authService.logout(logoutAuthDto.token)
    return new LogoutResDto(result)
  }
}
