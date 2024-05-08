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
  getDoc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { auth, db, storage } from '@/firebase/firebase'
import { useEffect, useState } from 'react'
import { PostInfo } from '@/types/user'
import { getDate } from '@/utils/postUtil'
import { usePathname, useRouter } from 'next/navigation'
import { deleteObject, ref } from 'firebase/storage'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useFeedLastVisible } from '@/context/feedProvider'

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

  const queryClient = useQueryClient()
  const { setLastVisible } = useFeedLastVisible()
  const pathname = usePathname()
  const mutatePostDelete = useMutation({
    mutationFn: async () => {
      await deleteDoc(doc(db, 'feed', id))
      // 이미지가 있다면 이미지도 삭제하기
      if (data.imageUrl) {
        const imageRef = ref(storage, `${data.userId}/${id}`)
        await deleteObject(imageRef)
      }
      // feed에 위치하지 않았을경우에는 리다이렉트 시키기
      if (pathname !== '/feed') {
        router.push('/feed')
      }
    },
    onMutate: () => {
      setLastVisible(undefined)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['feedData'],
      })
    },
  })

  const { data: likedId } = useQuery({
    queryKey: ['liked', id, loginUser],
    queryFn: async () => {
      const q = query(
        collection(db, 'liked'),
        where('feedId', '==', id),
        where('userId', '==', loginUser)
      )
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map((doc) => doc.id)
      return data
    },
  })

  const mutateLikeToggle = useMutation({
    mutationFn: async () => {
      if (likedId?.[0]) {
        // 현재 isLiked가 true라면
        // like 컬렉션에서 문서 삭제
        await deleteDoc(doc(db, 'liked', likedId?.[0]))
        // 피드 문서 업데이트
        const feedRef = doc(db, 'feed', id)
        await updateDoc(feedRef, {
          likeCount: increment(-1),
        })
      } else {
        // 현재 isLiked가 false 라면
        // like 컬렉션에 문서 생성
        const likedRef = doc(collection(db, 'liked'))
        const likedData = {
          userId: loginUser,
          feedId: id,
          createdAt: new Date(),
        }
        await setDoc(likedRef, likedData)
        // 피드 문서 업데이트
        const feedRef = doc(db, 'feed', id)
        await updateDoc(feedRef, {
          likeCount: increment(1),
        })
      }
    },
    onMutate: () => {
      setLastVisible(undefined)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['feedData'],
      })
      queryClient.invalidateQueries({
        queryKey: ['liked'],
      })
    },
  })

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
                <DropdownMenuItem onClick={() => mutatePostDelete.mutate()}>
                  삭제하기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      <CardContent
        className={pathname === '/feed' ? 'cursor-pointer' : ''}
        onClick={() =>
          pathname === '/feed' ? router.push(`/post/${id}`) : null
        }
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
          <button type='button' onClick={() => mutateLikeToggle.mutate()}>
            {likedId?.[0] ? (
              <Icon name='Heart' className='text-red-500 fill-red-500' />
            ) : (
              <Icon name='Heart' />
            )}
          </button>
          <span>{data.likeCount}</span>
        </div>
      </CardFooter>
    </Card>
  )
}

export default PostCard
