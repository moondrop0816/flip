import { DocumentData } from 'firebase/firestore'

export interface Post {
  userId: string
  content: string
  commentCount: number
  likeCount: number
  createdAt: Date
  updatedAt: Date
  imageUrl: string
}

export interface InfiniteScroll {
  dbName: string
  lastVisible: number | DocumentData | undefined
  firstLimitNum: number
  limitNum: number
}
