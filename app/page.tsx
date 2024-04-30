'use client'

import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import withAuth from '@/components/hocs/withAuth'
import PostCard from '@/components/post/postCard'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/firebase/firebase'
import { useEffect, useState } from 'react'
import { Post } from '@/types/post'

function Home() {
  const [feed, setFeed] = useState<{ id: string; data: Post }[]>([])

  const getFeedData = async () => {
    try {
      const q = query(collection(db, 'feed'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: {
          userId: doc.data().userId,
          content: doc.data().content,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          createdAt: doc.data().createdAt,
          updatedAt: doc.data().updatedAt,
          imageUrl: doc.data().imageUrl,
        },
      }))
      setFeed(data)
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  useEffect(() => {
    getFeedData()
  }, [])

  return (
    <>
      <Header />
      {feed.map((feedData) => {
        return (
          <PostCard key={feedData.id} id={feedData.id} data={feedData.data} />
        )
      })}

      <Footer isAddible={true} />
    </>
  )
}

export default withAuth(Home)
