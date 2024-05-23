'use client'

import { UserCard } from '@/components/follow/userCard'
import withAuth from '@/components/hocs/withAuth'
import { followDB, userDB } from '@/firebase/firebase'
import { getDocs, query, where } from 'firebase/firestore'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const FollowingPage = () => {
  const pathname = usePathname()
  const [followingList, setFollowingList] = useState<
    { followingUserId: string; followerUserId: string }[]
  >([])
  const getFollowers = async () => {
    // 현재 유저 가져오기
    const userId = pathname.split('/')[1]
    const userQ = query(userDB, where('userId', '==', userId))
    const userSnapshot = await getDocs(userQ)
    const userDoc = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }))[0]

    // 현재 유저의 uid로 팔로워 내용 가져오기
    const q = query(followDB, where('followerUserId', '==', userDoc.id))
    const querySnapshot = await getDocs(q)
    const data = querySnapshot.docs.map((doc) => ({
      followingUserId: doc.data().followingUserId,
      followerUserId: doc.data().followerUserId,
    }))
    setFollowingList(data)
  }

  useEffect(() => {
    getFollowers()
  }, [])

  return (
    <div>
      <h2 className='text-xl font-semibold'>팔로잉</h2>
      {followingList.length !== 0 ? (
        followingList.map(({ followingUserId }) => {
          return <UserCard key={followingUserId} userUid={followingUserId} />
        })
      ) : (
        <div>팔로잉이 존재하지 않습니다.</div>
      )}
    </div>
  )
}

export default withAuth(FollowingPage)
