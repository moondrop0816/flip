'use client'

import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '../ui/textarea'
import Reply from './reply'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { auth, db } from '@/firebase/firebase'
import {
  query,
  collection,
  where,
  getDocs,
  doc,
  setDoc,
  orderBy,
  updateDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Comment } from '@/types/post'

const formSchema = z.object({
  content: z.string({
    required_error: '내용을 입력해 주세요.',
  }),
})

const ReplyWrapper = ({
  feedId,
  commentCount,
}: {
  feedId: string
  commentCount: number
}) => {
  const [comment, setComment] = useState<{ id: string; data: Comment }[]>([])
  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  })

  const getReplyInfo = async () => {
    const q = query(
      collection(db, 'comment'),
      where('feedId', '==', feedId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      data: {
        userId: doc.data().userId,
        content: doc.data().content,
        createdAt: doc.data().createdAt.toDate(),
        feedId: doc.data().feedId,
      },
    }))
    setComment(data)
  }

  const onAddReply = async (data: z.infer<typeof formSchema>) => {
    try {
      const uid = auth.currentUser?.uid
      const q = query(collection(db, 'user'), where('uid', '==', uid))
      const querySnapshot = await getDocs(q)
      const userData = querySnapshot.docs.map((doc) => doc.data())[0]
      const commentDB = collection(db, 'comment')
      const commentData = {
        userId: userData.userId,
        feedId,
        content: data.content,
        createdAt: new Date(),
      }

      // 자동 생성 id로 문서 생성
      const commentRef = doc(commentDB)
      form.resetField('content') // 입력창 초기화

      // 피드 문서 업데이트
      const feedRef = doc(db, 'feed', feedId)
      await updateDoc(feedRef, { commentCount: commentCount + 1 })

      await setDoc(commentRef, commentData)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getReplyInfo()
  }, [])

  return (
    <section>
      <div className='mb-5'>
        {comment.map((reply) => {
          return <Reply key={reply.id} id={reply.id} data={reply.data} />
        })}
      </div>
      <Form {...form}>
        <form className='flex gap-2' onSubmit={form.handleSubmit(onAddReply)}>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem className='flex-grow'>
                <FormControl>
                  <Textarea
                    placeholder='내용을 입력해 주세요.'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='h-auto basis-16'>
            등록
          </Button>
        </form>
      </Form>
    </section>
  )
}

export default ReplyWrapper
