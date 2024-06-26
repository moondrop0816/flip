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
import { feedDB, likeDB, storage, userDB } from '@/firebase/firebase'
import { useEffect, useState } from 'react'
import { PostInfo } from '@/types/user'
import { getDate } from '@/utils/postUtil'
import { usePathname, useRouter } from 'next/navigation'
import { deleteObject, ref } from 'firebase/storage'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useFeedLastVisible } from '@/context/feedProvider'
import { useFollowFeedLastVisible } from '@/context/followFeedProvider'
import { useAuth } from '@/context/authProvider'

const PostCard = ({ id, data }: { id: string; data: Post }) => {
  const [userInfo, setUserInfo] = useState<PostInfo>({
    userId: '',
    nickname: '',
    profileImg: '',
  })
  const router = useRouter()

  const getUserInfo = async (userUid: string) => {
    try {
      const docRef = doc(userDB, userUid)
      const docData = await (await getDoc(docRef)).data()
      setUserInfo({
        userId: docData?.userId,
        nickname: docData?.nickname,
        profileImg: docData?.profileImg,
      })
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }

  const { user } = useAuth()

  const queryClient = useQueryClient()
  const { setLastVisible: setFeedVisible } = useFeedLastVisible()
  const { setLastVisible: setFollowVisible } = useFollowFeedLastVisible()
  const pathname = usePathname()

  const mutatePostDelete = useMutation({
    mutationFn: async () => {
      await deleteDoc(doc(feedDB, id))
      // 이미지가 있다면 이미지도 삭제하기
      if (data.imageUrl) {
        const imageRef = ref(storage, `${data.userUid}/${id}`)
        await deleteObject(imageRef)
      }
      // feed에 위치하지 않았을경우에는 리다이렉트 시키기
      if (pathname !== '/feed' && pathname !== '/followingFeed') {
        router.push('/feed')
      }
    },
    onMutate: () => {
      setFeedVisible(undefined)
      setFollowVisible(undefined)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['feedData'],
      })
      queryClient.invalidateQueries({
        queryKey: ['followFeedData'],
      })
    },
  })

  const { data: likeId } = useQuery({
    queryKey: ['like', id, user?.uid],
    queryFn: async () => {
      const q = query(
        likeDB,
        where('feedId', '==', id),
        where('userUid', '==', user?.uid)
      )
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map((doc) => doc.id)
      return data
    },
  })

  const mutateLikeToggle = useMutation({
    mutationFn: async () => {
      if (likeId?.[0]) {
        // 현재 isLiked가 true라면
        // like 컬렉션에서 문서 삭제
        await deleteDoc(doc(likeDB, likeId?.[0]))
        // 피드 문서 업데이트
        const feedRef = doc(feedDB, id)
        await updateDoc(feedRef, {
          likeCount: increment(-1),
        })
      } else {
        // 현재 isLiked가 false 라면
        // like 컬렉션에 문서 생성
        const likeRef = doc(likeDB)
        const likeData = {
          userUid: user?.uid,
          feedId: id,
          createdAt: new Date(),
        }
        await setDoc(likeRef, likeData)
        // 피드 문서 업데이트
        const feedRef = doc(feedDB, id)
        await updateDoc(feedRef, {
          likeCount: increment(1),
        })
      }
    },
    onMutate: () => {
      setFeedVisible(undefined)
      setFollowVisible(undefined)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['feedData'],
      })
      queryClient.invalidateQueries({
        queryKey: ['followFeedData'],
      })
      queryClient.invalidateQueries({
        queryKey: ['like'],
      })
    },
  })

  useEffect(() => {
    getUserInfo(data.userUid)
  }, [])

  return (
    <Card>
      <CardHeader className='flex flex-row justify-between'>
        <div className='flex items-center basis-[calc(100%-6rem)]'>
          <div
            className='w-10 h-10 rounded-full overflow-hidden cursor-pointer'
            onClick={() => router.push(`/${userInfo.userId}`)}
          >
            <img src={userInfo.profileImg} alt='프로필 이미지' />
          </div>
          <p
            className='ml-2 text-lg font-medium cursor-pointer'
            onClick={() => router.push(`/${userInfo.userId}`)}
          >
            {userInfo.nickname}
          </p>
          <CardDescription className='ml-1'>
            ‧ {getDate(data.createdAt)}
          </CardDescription>
        </div>
        <div className='basis-6'>
          {user?.uid === data.userUid && (
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
            {likeId?.[0] ? (
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
