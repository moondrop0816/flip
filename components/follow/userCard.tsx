'use client'

import { userDB } from '@/firebase/firebase'
import { useQuery } from '@tanstack/react-query'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { BtnFollow } from './btnFollow'
import { useAuth } from '@/context/authProvider'

export const UserCard = ({ userUid }: { userUid: string }) => {
  const { data: userInfo } = useQuery({
    queryKey: ['user', userUid],
    queryFn: async () => {
      const docRef = doc(userDB, userUid)
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
        <div>
          <p className='font-medium'>{userInfo?.data?.nickname}</p>
          <p className='text-sm text-slate-400'>{userInfo?.data?.userId}</p>
        </div>
      </div>
      {userInfo?.uid !== user?.uid && <BtnFollow userUid={userUid} />}
    </div>
  )
}
