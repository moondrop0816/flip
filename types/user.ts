import React from 'react'

export interface UserInfo {
  uid?: string
  userId: string
  email: string
  password: string
  passwordCheck: string
  nickname: string
  bio: string
  profileImg?: string
  createdAt?: string
  followerCount?: number
  followingCount?: number
}

export type LoginInfo = Pick<UserInfo, 'email' | 'password'>
export type MypageInfo = Pick<
  UserInfo,
  | 'userId'
  | 'nickname'
  | 'bio'
  | 'profileImg'
  | 'followerCount'
  | 'followingCount'
>
export type PostInfo = Pick<UserInfo, 'userId' | 'nickname' | 'profileImg'>
export type CurrentLoginUserInfo = Pick<
  UserInfo,
  | 'uid'
  | 'userId'
  | 'email'
  | 'nickname'
  | 'bio'
  | 'profileImg'
  | 'followerCount'
  | 'followingCount'
>

export type LoginUserInfoContextType = {
  loginUserInfo: CurrentLoginUserInfo | undefined
  setLoginUserInfo: React.Dispatch<
    React.SetStateAction<CurrentLoginUserInfo | undefined>
  >
}
