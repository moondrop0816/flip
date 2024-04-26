export interface UserInfo {
  userId: string
  email: string
  password: string
  passwordCheck: string
  nickname: string
  bio: string
  profileImg?: string
  createdAt?: string
}

export type LoginInfo = Pick<UserInfo, 'email' | 'password'>
