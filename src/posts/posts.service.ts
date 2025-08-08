import { Injectable } from '@nestjs/common'

@Injectable()
export class PostsService {
  getPosts() {
    return 'All Posts'
  }
  createPosts(body: any) {
    return body
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
