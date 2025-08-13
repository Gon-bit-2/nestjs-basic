import { Injectable } from '@nestjs/common'
import { UpdatePostBodyDto } from 'src/routes/posts/dto/post.dto'
import { PrismaService } from 'src/shared/service/prisma.service'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}
  getPosts(userId: number) {
    return this.prismaService.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
      },
    })
  }
  async createPosts(body: any, userId: number) {
    return await this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    })
  }
  getPost(userId: number) {
    return this.prismaService.post.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
      },
    })
  }
  updatePosts(postId: number, userId: number, body: UpdatePostBodyDto) {
    return this.prismaService.post.update({
      where: {
        id: postId,
        authorId: userId,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    })
  }
  deletePost(id: number, userId: number) {
    return this.prismaService.post.delete({
      where: {
        id: id,
        authorId: userId,
      },
    })
  }
}
