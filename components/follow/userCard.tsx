'use client'

import { userDB } from '@/firebase/firebase'
import { useQuery } from '@tanstack/react-query'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { BtnFollow } from './btnFollow'
import { useAuth } from '@/context/authProvider'

export const UserCard = ({
  type,
  followerUserId,
  followingUserId,
}: {
  type: 'following' | 'follower'
  followerUserId?: string
  followingUserId?: string
}) => {
  const typeUserUid = type === 'following' ? followingUserId : followerUserId
  const { data: userInfo } = useQuery({
    queryKey: ['user', typeUserUid],
    queryFn: async () => {
      const docRef = doc(userDB, typeUserUid)
      const docSnap = await getDoc(docRef)
      const docData = docSnap.data()
      const docId = docSnap.id

      return { uid: docId, data: docData }
    },
  })

  const router = useRouter()
  const { user } = useAuth()

  return (
    <div className='flex justify-between items-center border-b py-5'>
      <div
        className='flex items-center gap-2 cursor-pointer'
        onClick={() => router.push(`/${userInfo?.data?.userId}`)}
      >
        <div className='rounded-full overflow-hidden w-10 h-10'>
          <img src={userInfo?.data?.profileImg} alt='프로필 이미지' />
        </div>
        <p className='font-medium'>{userInfo?.data?.nickname}</p>
      </div>
      {userInfo?.uid !== user?.uid && (
        <BtnFollow followingUserUid={followingUserId} />
      )}
    </div>
  )
}
