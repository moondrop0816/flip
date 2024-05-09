'use client'

import { db } from '@/firebase/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { MypageInfo } from '@/types/user'
import { Button } from '@/components/ui/button'
import Icon from '@/components/icon'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import withAuth from '@/components/hocs/withAuth'
import Link from 'next/link'
import { useLoginUserInfo } from '@/context/loginUserInfoProvider'

const MyPage = () => {
  const path = usePathname()
  const [userInfo, setUserInfo] = useState<MypageInfo>({
    userId: '',
    nickname: '',
    bio: '',
    profileImg: './defaultProfile.png',
    followerCount: 0,
    followingCount: 0,
  })

  const { loginUserInfo } = useLoginUserInfo()

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
        followerCount: data.followerCount,
        followingCount: data.followingCount,
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
            {loginUserInfo?.userId === userInfo.userId ? (
              <Button>프로필 수정</Button>
            ) : (
              <Button>
                <Icon name='Send' className='mr-2 h-4 w-4' />
                DM
              </Button>
              // TODO: 팔로우 버튼 추가해주기
            )}
          </div>
        </div>
        <p className='text-lg font-bold'>{userInfo.nickname}</p>
        <p className='text-gray-500 mb-2'>{`@${userInfo.userId}`}</p>
        <p>{userInfo.bio}</p>
        <div>
          <div>
            <span>팔로잉</span>
            <Link href={'/feed'}>{userInfo.followingCount}</Link>
          </div>
          <div>
            <span>팔로워</span>
            <Link href={'/feed'}>{userInfo.followerCount}</Link>
          </div>
        </div>
      </div>
      <div>탭버튼</div>
      <div>게시글 보여줄 영역</div>
    </section>
  )
}

export default withAuth(MyPage)
