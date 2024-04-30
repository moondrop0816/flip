import { Timestamp } from 'firebase/firestore'

export interface Post {
  userId: string
  content: string
  commentCount: number
  likeCount: number
  createdAt: Timestamp
  updatedAt: Timestamp
  imageUrl: string
}
