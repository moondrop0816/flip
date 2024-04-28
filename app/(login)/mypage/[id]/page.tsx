'use client'

import { db } from '@/firebase/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { MypageInfo } from '@/types/user'
import { Button } from '@/components/ui/button'
import Icon from '@/components/icon'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import withAuth from '@/components/hocs/withAuth'

const MyPage = () => {
  const path = usePathname()
  const [userInfo, setUserInfo] = useState<MypageInfo>({
    userId: '',
    nickname: '',
    bio: '',
    profileImg: './defaultProfile.png',
  })

  const getUserInfo = async (userId: string) => {
    try {
      const q = query(collection(db, 'user'), where('userId', '==', userId))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map((doc) => doc.data())[0]
      setUserInfo({
        userId: data.userId,
        nickname: data.nickname,
        bio: data.bio,
        profileImg: data.profileImg,
      })
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  useEffect(() => {
    getUserInfo(path.split('/')[path.split('/').length - 1])
  }, [])

  return (
    <section>
      <div>
        <div className='flex justify-between items-start'>
          <div className='rounded-full overflow-hidden w-1/6 mb-5'>
            <img src={userInfo.profileImg} alt='프로필 이미지' />
          </div>
          <div className='flex items-center gap-1'>
            <Button>
              <Icon name='Send' className='mr-2 h-4 w-4' />
              DM
            </Button>
            <Button>프로필 수정</Button>
          </div>
        </div>
        <p className='text-lg font-bold'>{userInfo.nickname}</p>
        <p className='text-gray-500 mb-2'>{`@${userInfo.userId}`}</p>
        <p>{userInfo.bio}</p>
      </div>
    </section>
  )
}

export default withAuth(MyPage)
