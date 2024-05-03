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
  firstLimitNum: number
  limitNum: number
}

export interface Comment {
  userId: string
  feedId: string
  createdAt: Date
  content: string
}
