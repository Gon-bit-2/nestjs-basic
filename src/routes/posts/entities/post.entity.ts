export class Post {
  id: number
  title: string
  content: string
  authorId: number
  createdAt: Date
  updatedAt: Date
  constructor(partial: Partial<Post>) {
    Object.assign(this, partial)
  }
}
