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
  getDoc,
  limit,
  startAfter,
  DocumentData,
} from 'firebase/firestore'
import { Comment } from '@/types/post'
import React, { useEffect } from 'react'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useBottomScrollListener } from 'react-bottom-scroll-listener'
import { useReplyLastVisible } from '@/provider/replyProvider'

const formSchema = z.object({
  content: z.string({
    required_error: '내용을 입력해 주세요.',
  }),
})

// let lastVisible: number | DocumentData | undefined = undefined

const ReplyWrapper = ({ feedId }: { feedId: string }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  })

  const { lastVisible, setLastVisible } = useReplyLastVisible()

  const getCommentData = async () => {
    const commentData: { id: string; data: Comment }[] = []

    let q
    if (lastVisible === -1) {
      return
    } else if (lastVisible) {
      q = query(
        collection(db, 'comment'),
        where('feedId', '==', feedId),
        orderBy('createdAt', 'desc'),
        limit(5),
        startAfter(lastVisible)
      )
    } else {
      q = query(
        collection(db, 'comment'),
        where('feedId', '==', feedId),
        orderBy('createdAt', 'desc'),
        limit(10)
      )
    }

    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      commentData.push({
        id: doc.id,
        data: {
          userId: doc.data().userId,
          content: doc.data().content,
          createdAt: doc.data().createdAt.toDate(),
          feedId: doc.data().feedId,
        },
      })

      if (querySnapshot.docs.length < 5) {
        setLastVisible(-1)
        // lastVisible = -1
      } else {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
        // lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]
      }
    })

    console.log(commentData)

    return commentData
  }

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['commentData', feedId],
    queryFn: getCommentData,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage && lastPage.length !== 0 ? allPages.length + 1 : null
    },
  })

  useBottomScrollListener(() => {
    if (lastVisible !== -1) {
      fetchNextPage()
    }
  })

  // useEffect(() => {
  // if (lastVisible !== undefined) {
  //   setLastVisible(undefined)
  // fetchNextPage()
  // }
  // }, [lastVisible])

  console.log(data?.pages)
  console.log(data?.pageParams)

  console.log('lastVisible', lastVisible)

  const onAddReply = async (data: z.infer<typeof formSchema>) => {
    commentAdd.mutate(data)
    // try {
    //   const uid = auth.currentUser?.uid
    //   const q = query(collection(db, 'user'), where('uid', '==', uid))
    //   const querySnapshot = await getDocs(q)
    //   const userData = querySnapshot.docs.map((doc) => doc.data())[0]
    //   const commentDB = collection(db, 'comment')
    //   const commentData = {
    //     userId: userData.userId,
    //     feedId,
    //     content: data.content,
    //     createdAt: new Date(),
    //   }

    //   // 자동 생성 id로 문서 생성
    //   const commentRef = doc(commentDB)
    //   form.resetField('content') // 입력창 초기화

    //   // 피드 문서 업데이트
    //   const feedRef = doc(db, 'feed', feedId)
    //   const feedSnap = await getDoc(feedRef)
    //   await updateDoc(feedRef, {
    //     commentCount: feedSnap.data()?.commentCount + 1,
    //   })

    //   await setDoc(commentRef, commentData)
    // } catch (error) {
    //   console.log(error)
    // }
  }
  const queryClient = useQueryClient()
  const commentAdd = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
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
      const feedSnap = await getDoc(feedRef)
      await updateDoc(feedRef, {
        commentCount: feedSnap.data()?.commentCount + 1,
      })

      await setDoc(commentRef, commentData)
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

  return (
    <section>
      <div className='mb-5'>
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page?.map((feedData) => (
              <Reply key={feedData.id} id={feedData.id} data={feedData.data} />
            ))}
          </React.Fragment>
        ))}
        {!hasNextPage && (
          <div className='p-6 pb-0 text-center text-slate-400'>
            댓글이 없습니다.
          </div>
        )}
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
