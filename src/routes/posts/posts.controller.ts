import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common'
import { PostsService } from 'src/routes/posts/posts.service'
import { AccessTokenGuard } from 'src/shared/guard/access-token.guard'
import { XApiKeyGuard } from 'src/shared/guard/x-api-key.guard'
import { type Request } from 'express'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { CreatePostBodyDto, GetPostItemDto, UpdatePostBodyDto } from 'src/routes/posts/dto/post.dto'
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get()
  @UseGuards(AccessTokenGuard)
  getPosts(@Param() @ActiveUser('userId') userId: number) {
    return this.postsService.getPosts(userId)
  }
  @Post()
  @UseGuards(AccessTokenGuard)
  @UseGuards(XApiKeyGuard)
  async createPosts(@Body() body: CreatePostBodyDto, @ActiveUser('userId') userId: number) {
    return new GetPostItemDto(await this.postsService.createPosts(body, userId))
  }
  @UseGuards(AccessTokenGuard)
  @UseGuards(XApiKeyGuard)
  @Get(':id')
  async getPost(@Param('id') id: string) {
    return new GetPostItemDto(await this.postsService.getPost(Number(id)))
  }
  @UseGuards(AccessTokenGuard)
  @UseGuards(XApiKeyGuard)
  @Put(':id')
  async updatePosts(@Param('id') id: string, @Body() body: UpdatePostBodyDto, @ActiveUser('userId') userId: number) {
    return new GetPostItemDto(await this.postsService.updatePosts(Number(id), userId, body))
  }
  @UseGuards(AccessTokenGuard)
  @UseGuards(XApiKeyGuard)
  @Delete(':id')
  deletePost(@Param(':id') id: string, @ActiveUser('userId') userId: number) {
    return this.postsService.deletePost(Number(id), userId)
  }
}
