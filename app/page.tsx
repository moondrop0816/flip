'use client'

import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import withAuth from '@/components/hocs/withAuth'
import PostCard from '@/components/post/postCard'
import { InfiniteScroll } from '@/types/post'
import React from 'react'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

function Home() {
  const feedObj: InfiniteScroll = {
    dbName: 'feed',
    limitNum: 5,
  }
  const { items, hasNextPage } = useInfiniteScroll(feedObj)

  return (
    <>
      <Header />
      {items?.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page?.map((feedData) => (
            <PostCard key={feedData.id} id={feedData.id} data={feedData.data} />
          ))}
        </React.Fragment>
      ))}
      {!hasNextPage && (
        <div className='mb-16 p-6 pb-20 text-center text-slate-400'>
          마지막 게시글입니다.
        </div>
      )}
      <Footer isAddible={true} />
    </>
  )
}

export default withAuth(Home)
