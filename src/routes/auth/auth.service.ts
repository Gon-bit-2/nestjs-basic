import { BadRequestException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { CreateAuthDto } from './dto/create-auth.dto'
import { HashingService } from 'src/shared/service/hashing.service'
import { PrismaService } from 'src/shared/service/prisma.service'
import { TokenService } from 'src/shared/service/token.service'
import { LoginAuthDto } from 'src/routes/auth/dto/login-auth.dto'
import { Prisma } from '@prisma/client'

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

  async refreshToken(refreshToken: string) {
    try {
      const decoded = await this.tokenService.verifyRefreshToken(refreshToken)
      const { userId } = decoded
      //check exists
      const isExists = await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken,
        },
      })
      if (isExists) {
        await this.prismaService.refreshToken.delete({
          where: {
            token: refreshToken,
          },
        })
      }

      //gen new token
      return await this.generateTokens({ userId })
    } catch (error) {
      // refresh token đã sử dụng hc bị đánh cắp
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new UnauthorizedException('RefreshTToken has been revoked')
      }
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  async logout(refreshToken: string) {
    try {
      //check exists
      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken,
        },
      })

      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      })
      return { message: 'Logout Successfully' }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') throw new UnauthorizedException('RefreshTToken has been revoked')
      }
      throw new UnauthorizedException('Invalid refresh token')
    }
  }

  remove(id: number) {
    return `This action removes a #${id} auth`
  }
}
