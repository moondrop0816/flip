import { DocumentData } from 'firebase/firestore'

export interface Post {
  userUid: string
  content: string
  commentCount: number
  likeCount: number
  createdAt: Date
  updatedAt: Date
  imageUrl: string
}

export interface Comment {
  userUid: string
  feedId: string
  createdAt: Date
  content: string
}

export type LastVisibleContextType = {
  lastVisible: number | DocumentData | undefined
  setLastVisible: React.Dispatch<
    React.SetStateAction<number | DocumentData | undefined>
  >
}
