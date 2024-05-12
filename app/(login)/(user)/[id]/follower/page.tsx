'use client'

import { UserCard } from '@/components/follow/userCard'
import withAuth from '@/components/hocs/withAuth'
import { userDB, followDB } from '@/firebase/firebase'
import { query, where, getDocs } from 'firebase/firestore'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const FollowerPage = () => {
  const pathname = usePathname()
  const [followerList, setFollowerList] = useState<
    { followingUserId: string; followerUserId: string }[]
  >([])
  const getFollowers = async () => {
    // 현재 유저 가져오기
    const userId = pathname.split('/')[1]
    const userQ = query(userDB, where('userId', '==', userId))
    const userSnapshot = await getDocs(userQ)
    const userDoc = userSnapshot.docs.map((doc) => doc.data())[0]

    // 현재 유저를 팔로잉하는 리스트 가져오기
    const q = query(followDB, where('followingUserId', '==', userDoc.uid))
    const querySnapshot = await getDocs(q)
    const data = querySnapshot.docs.map((doc) => ({
      followingUserId: doc.data().followingUserId,
      followerUserId: doc.data().followerUserId,
    }))
    setFollowerList(data)
  }

  useEffect(() => {
    getFollowers()
  }, [])

  return (
    <div>
      <h2 className='text-xl font-semibold'>팔로워</h2>
      {followerList.map(({ followerUserId }) => {
        return (
          <UserCard
            key={followerUserId}
            type='follower'
            followerUserId={followerUserId}
          />
        )
      })}
    </div>
  )
}

export default withAuth(FollowerPage)
