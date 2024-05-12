'use client'

import withAuth from '@/components/hocs/withAuth'
import PostCard from '@/components/post/postCard'
import { Post } from '@/types/post'
import React, { useEffect, useState } from 'react'
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore'
import { auth, db, followDB, userDB } from '@/firebase/firebase'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useBottomScrollListener } from 'react-bottom-scroll-listener'
import { useFollowFeedLastVisible } from '@/context/followFeedProvider'
import useUser from '@/hooks/auth/useUser'

function FollowingFeed() {
  const { user, loading } = useUser()

  useEffect(() => {
    const test = async () => {
      // 로그인 유저의 팔로잉 목록 가져오기
      const followQ = query(followDB, where('followerUserId', '==', user?.uid))
      const followSnap = await getDocs(followQ)
      const followData = followSnap.docs.map(
        (doc) => doc.data().followingUserId
      )
      console.log(followData)
      // 유저 아이디 가져오기 -> 수정해야함
    }
    test()
  }, [user])

  const { lastVisible, setLastVisible } = useFollowFeedLastVisible()
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
    queryKey: ['followFeedData'],
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
              queryKey='followFeedData'
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

export default withAuth(FollowingFeed)
