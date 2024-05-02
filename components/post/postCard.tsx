'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Icon from '../icon'
import { Post } from '@/types/post'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { auth, db, storage } from '@/firebase/firebase'
import { useEffect, useState } from 'react'
import { PostInfo } from '@/types/user'
import { getDate } from '@/utils/postUtil'
import { useRouter } from 'next/navigation'
import { deleteObject, ref } from 'firebase/storage'

const PostCard = ({ id, data }: { id: string; data: Post }) => {
  const [userInfo, setUserInfo] = useState<PostInfo>({
    userId: '',
    nickname: '',
    profileImg: '',
  })
  const [loginUser, setLoginUser] = useState('')
  const router = useRouter()

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

  const onPostDelete = async () => {
    try {
      console.log('글 삭제')
      await deleteDoc(doc(db, 'feed', id))
      // 이미지가 있다면 이미지도 삭제하기
      if (data.imageUrl) {
        const imageRef = ref(storage, `${data.userId}/${id}`)
        await deleteObject(imageRef)
      }
      alert('게시글이 삭제되었습니다.')
    } catch (error) {
      console.error('삭제 에러', error)
    }
  }

  useEffect(() => {
    getUserInfo(data.userId)
    nowLoginUser()
  }, [])

  return (
    <Card>
      <CardHeader className='flex flex-row justify-between'>
        <div className='flex items-center basis-[calc(100%-6rem)]'>
          <div className='w-10 h-10 rounded-full overflow-hidden'>
            <img src={userInfo.profileImg} alt='프로필 이미지' />
          </div>
          <p className='ml-2 text-lg font-medium'>{userInfo.nickname}</p>
          <CardDescription className='ml-1'>
            ‧ {getDate(data.createdAt)}
          </CardDescription>
        </div>
        <div className='basis-6'>
          {loginUser === data.userId && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Icon name='Ellipsis' />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => router.push(`/editpost/${id}`)}
                >
                  수정하기
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onPostDelete}>
                  삭제하기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent
        className='cursor-pointer'
        onClick={() => router.push(`/post/${id}`)}
      >
        <pre>{data.content}</pre>
        {data.imageUrl && (
          <div className='max-w-md aspect-auto mt-5'>
            <img src={data.imageUrl} alt='게시글 이미지' />
          </div>
        )}
      </CardContent>
      <CardFooter className='flex justify-between items-center'>
        <div className='flex items-center gap-1'>
          <Icon name='MessageCircle' />
          <span>{data.commentCount}</span>
        </div>
        <div className='flex items-center gap-1'>
          <button type='button'>
            <Icon name='Heart' />
          </button>
          <span>{data.likeCount}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

export default PostCard