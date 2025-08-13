import { Type } from 'class-transformer'
import { IsString } from 'class-validator'
import { Post } from 'src/routes/posts/entities/post.entity'
import { UserModel } from 'src/shared/models/user.model'

export class GetPostItemDto extends Post {
  @Type(() => UserModel)
  author: Omit<UserModel, 'password'>
}

export class CreatePostBodyDto {
  @IsString()
  title: string

  @IsString()
  content: string
}

export class UpdatePostBodyDto extends CreatePostBodyDto {}
