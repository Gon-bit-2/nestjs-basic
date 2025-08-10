import { Injectable } from '@nestjs/common'
import envConfig from 'src/shared/config'
import { PrismaService } from 'src/shared/service/prisma.service'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}
  getPosts() {
    console.log(envConfig.ACCESS_TOKEN_SECRET)
    return this.prismaService.post.findMany()
  }
  createPosts(body: any) {
    const userId = 1
    return this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    })
  }
  getPost(id: string) {
    return `get post with id : ${id} success`
  }
  updatePosts(id: string, body: any) {
    return `update post with id : ${id} success,data:${body}`
  }
  deletePost(id: string) {
    return `delete post with id : ${id} success`
  }
}
