import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { PostsService } from 'src/routes/posts/posts.service'
import { AccessTokenGuard } from 'src/shared/guard/access-token.guard'
import { XApiKeyGuard } from 'src/shared/guard/x-api-key.guard'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get()
  @UseGuards(AccessTokenGuard)
  getPosts() {
    return this.postsService.getPosts()
  }
  @Post()
  @UseGuards(AccessTokenGuard)
  @UseGuards(XApiKeyGuard)
  createPosts(@Body() body: any) {
    return this.postsService.createPosts(body)
  }
  @Get(':id')
  getPost(@Param('id') id: string) {
    return this.postsService.getPost(id)
  }
  @Put(':id')
  updatePosts(@Param('id') id: string, @Body() body: any) {
    return this.postsService.updatePosts(id, body)
  }

  @Delete(':id')
  deletePost(@Param(':id') id: string) {
    return this.postsService.deletePost(id)
  }
}
