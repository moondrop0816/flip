'use client'

import { db } from '@/firebase/firebase'
import {
  DocumentData,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useBottomScrollListener } from 'react-bottom-scroll-listener'
import { InfiniteScroll, Post } from '@/types/post'

let lastVisible: number | DocumentData | undefined = undefined

export const useInfiniteScroll = ({
  dbName,
  firstLimitNum,
  limitNum,
}: InfiniteScroll) => {
  const getData = async () => {
    let q
    if (lastVisible === -1) {
      return []
    } else if (lastVisible) {
      q = query(
        collection(db, dbName),
        orderBy('createdAt', 'desc'),
        limit(limitNum),
        startAfter(lastVisible)
      )
    } else {
      q = query(
        collection(db, dbName),
        orderBy('createdAt', 'desc'),
        limit(firstLimitNum)
      )
    }

    const dataArr: { id: string; data: Post }[] = []
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      dataArr.push({
        id: doc.id,
        data: {
          userId: doc.data().userId,
          content: doc.data().content,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate(),
          imageUrl: doc.data().imageUrl,
        },
      })

      if (querySnapshot.docs.length === 0) {
        lastVisible = -1
      } else {
        lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
      }
    })

    return dataArr
  }

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: [`${dbName}Data`],
    queryFn: getData,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage && lastPage.length !== 0 ? allPages.length + 1 : null
    },
  })

  const items = data?.pages

  useBottomScrollListener(() => {
    fetchNextPage()
  })

  return { items, hasNextPage }
}
