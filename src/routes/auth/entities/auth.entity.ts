import { Exclude } from 'class-transformer'

export class Auth {
  email: string
  name: string
  @Exclude() password: string
  createdAt: Date
  updatedAt: Date
  id: number
  constructor(partial: Partial<Auth>) {
    Object.assign(this, partial)
  }
}
