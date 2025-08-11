import { BadRequestException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { CreateAuthDto } from './dto/create-auth.dto'
import { UpdateAuthDto } from './dto/update-auth.dto'
import { HashingService } from 'src/shared/service/hashing.service'
import { PrismaService } from 'src/shared/service/prisma.service'
import { TokenService } from 'src/shared/service/token.service'
import { LoginAuthDto } from 'src/routes/auth/dto/login-auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}
  async register(createAuthDto: CreateAuthDto) {
    try {
      const hashedPassword = await this.hashingService.hash(createAuthDto.password)
      const user = await this.prismaService.user.create({
        data: {
          email: createAuthDto.email,
          name: createAuthDto.name,
          password: hashedPassword,
        },
      })
      return user
    } catch (error) {
      console.log(error)

      throw new BadRequestException('Loi roi ')
    }
  }

  async signIn(body: LoginAuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    })
    if (!user) {
      throw new UnauthorizedException('User not exists')
    }
    const isPasswordMatch = await this.hashingService.compare(body.password, user.password)
    if (!isPasswordMatch) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          message: 'Invalid password',
        },
      ])
    }
    const tokens = await this.generateTokens({ userId: user.id })
    return tokens
  }

  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ])
    const decodedRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
      },
    })
    return {
      accessToken,
      refreshToken,
    }
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`
  }

  remove(id: number) {
    return `This action removes a #${id} auth`
  }
}
