'use client'

import { Comment } from '@/types/post'
import { getDate } from '@/utils/postUtil'
import { commentDB, userDB } from '@/firebase/firebase'
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'
import { PostInfo } from '@/types/user'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Icon from '../icon'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useReplyLastVisible } from '@/context/replyProvider'
import { useAuth } from '@/context/authProvider'

const Reply = ({ id, data }: { id: string; data: Comment }) => {
  const queryClient = useQueryClient()
  const [userInfo, setUserInfo] = useState<PostInfo>({
    userId: '',
    nickname: '',
    profileImg: '',
  })

  const [isEdit, setIsEdit] = useState(false)
  const content = useRef<HTMLTextAreaElement>(null)

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

  const { setLastVisible } = useReplyLastVisible()
  const { user } = useAuth()

  const commentEdit = useMutation({
    mutationFn: async () => {
      // 변경사항이 없을때는 요청 보내지 않게 하기
      if (data.content === content.current?.value) {
        setIsEdit(false)
        return
      }

      if (content.current?.value !== '') {
        const docRef = doc(commentDB, id)
        await updateDoc(docRef, { content: content.current?.value })
        setIsEdit(false)
      }
    },
    onMutate: () => {
      setLastVisible(undefined)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['commentData'],
      })
    },
  })

  const commentDelete = useMutation({
    mutationFn: async () => {
      await deleteDoc(doc(commentDB, id))
    },
    onMutate: () => {
      setLastVisible(undefined)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['commentData'],
      })
    },
  })

  useEffect(() => {
    getUserInfo(data.userUid)
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
            {user?.uid === data.userUid && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Icon name='Ellipsis' />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsEdit(!isEdit)}>
                    수정하기
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => commentDelete.mutate()}>
                    삭제하기
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <div className='flex gap-2'>
          {isEdit ? (
            <>
              <Textarea
                defaultValue={data.content}
                className='resize-none'
                ref={content}
              />
              <Button
                type='button'
                className='h-auto'
                onClick={() => commentEdit.mutate()}
              >
                수정하기
              </Button>
            </>
          ) : (
            <pre>{data.content}</pre>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reply
