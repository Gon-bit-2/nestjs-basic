import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateAuthDto } from './dto/create-auth.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { Auth } from 'src/routes/auth/entities/auth.entity'
import { LoginAuthDto, LoginResDto } from 'src/routes/auth/dto/login-auth.dto'
import { RefreshTokenBody, RefreshTokenBodyResDto } from 'src/routes/auth/dto/refreshtoken-auth.dto'

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
  async refreshToken(@Body() refreshTokenBody: RefreshTokenBody) {
    const result = await this.authService.refreshToken(refreshTokenBody.token)
    return new RefreshTokenBodyResDto(result)
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.authService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id)
  }
}
