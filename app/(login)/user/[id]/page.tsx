'use client'

import { userDB } from '@/firebase/firebase'
import { getDocs, query, where } from 'firebase/firestore'
import { Button } from '@/components/ui/button'
import Icon from '@/components/icon'
import { usePathname } from 'next/navigation'
import withAuth from '@/components/hocs/withAuth'
import Link from 'next/link'
import { useLoginUserInfo } from '@/context/loginUserInfoProvider'
import { BtnFollow } from '@/components/follow/btnFollow'
import { useQuery } from '@tanstack/react-query'

const MyPage = () => {
  const path = usePathname()
  const { loginUserInfo } = useLoginUserInfo()

  const { data: userInfo } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const userId = path.split('/')[path.split('/').length - 1]
      const q = query(userDB, where('userId', '==', userId))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }))[0]
      return data
    },
  })

  return (
    <section>
      <div>
        <div className='flex justify-between items-start'>
          <div className='rounded-full overflow-hidden w-1/6 mb-5'>
            <img src={userInfo?.data.profileImg} alt='프로필 이미지' />
          </div>
          <div className='flex items-center gap-1'>
            {loginUserInfo?.userId === userInfo?.data.userId ? (
              <Button variant={'outline'}>프로필 수정</Button>
            ) : (
              <>
                <Button variant={'outline'}>
                  <Icon name='Send' className='mr-2 h-4 w-4' />
                  DM
                </Button>
                <BtnFollow followingUserUid={userInfo?.id} />
              </>
            )}
          </div>
        </div>
        <p className='text-lg font-bold'>{userInfo?.data.nickname}</p>
        <p className='text-gray-500 mb-2'>{`@${userInfo?.data.userId}`}</p>
        <p>{userInfo?.data.bio}</p>
        <div className='flex justify-start items-center gap-5 mt-2'>
          <div className='flex items-center gap-1'>
            <span className='font-semibold'>팔로잉</span>
            <Link href={'/feed'}>{userInfo?.data.followingCount}</Link>
          </div>
          <div className='flex items-center gap-1'>
            <span className='font-semibold'>팔로워</span>
            <Link href={'/feed'}>{userInfo?.data.followerCount}</Link>
          </div>
        </div>
      </div>
      <div>탭버튼</div>
      <div>게시글 보여줄 영역</div>
    </section>
  )
}

export default withAuth(MyPage)
