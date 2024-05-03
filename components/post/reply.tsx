'use client'

import { Comment } from '@/types/post'
import { getDate } from '@/utils/postUtil'
import { db, auth } from '@/firebase/firebase'
import { query, collection, where, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { PostInfo } from '@/types/user'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Icon from '../icon'

const Reply = ({ id, data }: { id: string; data: Comment }) => {
  const [userInfo, setUserInfo] = useState<PostInfo>({
    userId: '',
    nickname: '',
    profileImg: '',
  })
  const [loginUser, setLoginUser] = useState('')

  const getUserInfo = async (userId: string) => {
    try {
      const q = query(collection(db, 'user'), where('userId', '==', userId))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map((doc) => doc.data())[0]
      setUserInfo({
        userId: data.userId,
        nickname: data.nickname,
        profileImg: data.profileImg,
      })
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  // * TODO: authProvider로 작성하면서 제거하기
  const nowLoginUser = async () => {
    const uid = auth.currentUser?.uid
    const q = query(collection(db, 'user'), where('uid', '==', uid))
    const querySnapshot = await getDocs(q)
    const userData = querySnapshot.docs.map((doc) => doc.data())[0]
    setLoginUser(userData.userId)
  }

  useEffect(() => {
    getUserInfo(data.userId)
    nowLoginUser()
  }, [])

  return (
    <div className='flex items-start border-b p-5 gap-2'>
      <div className='w-10 h-10 rounded-full overflow-hidden'>
        <img src={userInfo.profileImg} alt='프로필 이미지' />
      </div>
      <div className='grow'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center'>
            <p className='font-medium'>{userInfo.nickname}</p>
            <span className='ml-1 text-xs text-muted-foreground'>
              ‧ {getDate(data.createdAt)}
            </span>
          </div>
          <div className='basis-6'>
            {loginUser === data.userId && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Icon name='Ellipsis' />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>수정하기</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('삭제')}>
                    삭제하기
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <div>
          <pre>{data.content}</pre>
        </div>
      </div>
    </div>
    // <Card>
    //   <CardHeader className='flex flex-row justify-between'>
    //     <div className='flex items-center basis-[calc(100%-6rem)]'>
    //       <div className='w-10 h-10 rounded-full overflow-hidden'>
    //         <img src={userInfo.profileImg} alt='프로필 이미지' />
    //       </div>
    //       <p className='ml-2 text-lg font-medium'>{userInfo.nickname}</p>
    //       <CardDescription className='ml-1'>
    //         ‧ {getDate(data.createdAt)}
    //       </CardDescription>
    //     </div>
    // <div className='basis-6'>
    //   {loginUser === data.userId && (
    //     <DropdownMenu>
    //       <DropdownMenuTrigger>
    //         <Icon name='Ellipsis' />
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent>
    //         <DropdownMenuItem>수정하기</DropdownMenuItem>
    //         <DropdownMenuItem onClick={() => console.log('삭제')}>
    //           삭제하기
    //         </DropdownMenuItem>
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   )}
    // </div>
    //   </CardHeader>
    //   <CardContent>
    //     <pre>{data.content}</pre>
    //   </CardContent>
    // </Card>
  )
}

export default Reply
