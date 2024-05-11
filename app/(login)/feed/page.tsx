'use client'

import withAuth from '@/components/hocs/withAuth'
import PostCard from '@/components/post/postCard'
import { Post } from '@/types/post'
import React from 'react'
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore'
import { db } from '@/firebase/firebase'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useBottomScrollListener } from 'react-bottom-scroll-listener'
import { useFeedLastVisible } from '@/context/feedProvider'

function Feed() {
  const { lastVisible, setLastVisible } = useFeedLastVisible()
  const getFeedData = async () => {
    const feedData: { id: string; data: Post }[] = []

    let q
    if (lastVisible === -1) {
      return
    } else if (lastVisible) {
      q = query(
        collection(db, 'feed'),
        orderBy('createdAt', 'desc'),
        limit(5),
        startAfter(lastVisible)
      )
    } else {
      q = query(collection(db, 'feed'), orderBy('createdAt', 'desc'), limit(10))
    }

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      feedData.push({
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

      if (querySnapshot.docs.length < 5) {
        setLastVisible(-1)
      } else {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
      }
    })

    return feedData
  }

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['feedData'],
    queryFn: getFeedData,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage && lastPage.length !== 0 ? allPages.length + 1 : null
    },
  })

  useBottomScrollListener(() => {
    if (lastVisible !== -1) {
      fetchNextPage()
    }
  })

  return (
    <>
      {data?.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page?.map((feedData) => (
            <PostCard
              key={feedData.id}
              id={feedData.id}
              data={feedData.data}
              queryKey='feedData'
              setLastVisible={setLastVisible}
            />
          ))}
        </React.Fragment>
      ))}
      {!hasNextPage && (
        <div className='text-center text-slate-400'>게시글이 없습니다.</div>
      )}
    </>
  )
}

export default withAuth(Feed)
