'use client'

import withAuth from '@/components/hocs/withAuth'
import Icon from '@/components/icon'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useFeedLastVisible } from '@/context/feedProvider'
import { db, storage } from '@/firebase/firebase'
import { Post } from '@/types/post'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  content: z.string({
    required_error: '내용을 입력해 주세요.',
  }),
})

const EditPostPage = () => {
  const path = usePathname()
  const postId = path.split('/')[path.split('/').length - 1]

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  })

  const router = useRouter()
  const [imgPreview, setImgPreview] = useState('') // TODO: 이미지 가져와서 세팅하기
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [prevData, setPrevData] = useState<Post | null>(null)

  const fileChange = (fileBlob: File) => {
    const reader = new FileReader()
    reader.readAsDataURL(fileBlob)
    setSelectedFile(fileBlob)
    return new Promise((resolve) => {
      reader.onload = () => {
        setImgPreview(reader.result as string)
        resolve(null)
      }
    })
  }

  const getPostInfo = async (postId: string) => {
    const docRef = doc(db, 'feed', postId)
    const docSnap = await getDoc(docRef)
    const data: Post = {
      userId: docSnap.data()?.userId,
      content: docSnap.data()?.content,
      commentCount: docSnap.data()?.commentCount,
      likeCount: docSnap.data()?.likeCount,
      createdAt: docSnap.data()?.createdAt.toDate(),
      updatedAt: docSnap.data()?.updatedAt.toDate(),
      imageUrl: docSnap.data()?.imageUrl,
    }

    setPrevData(data)
    if (data.imageUrl) {
      setImgPreview(data.imageUrl)
    }
  }

  const queryClient = useQueryClient()
  const { setLastVisible } = useFeedLastVisible()
  const mutatePostEdit = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const docRef = doc(db, 'feed', postId)
      const updateData: {
        content: string
        updatedAt: Date
        imageUrl?: string
      } = {
        content: data.content,
        updatedAt: new Date(),
      }

      // 이미지가 새로 변경되었다면
      if (selectedFile) {
        const imageRef = ref(storage, `${prevData?.userId}/${postId}`)
        await uploadBytes(imageRef, selectedFile)
        const downloadURL = await getDownloadURL(imageRef)
        updateData['imageUrl'] = downloadURL
      }

      // 기존 이미지가 삭제되었다면
      if (!imgPreview && !selectedFile) {
        updateData['imageUrl'] = ''
        const imageRef = ref(storage, `${prevData?.userId}/${postId}`)
        await deleteObject(imageRef)
      }

      await updateDoc(docRef, updateData)
      router.push(`/post/${postId}`)
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

  const onEditPost = async (data: z.infer<typeof formSchema>) => {
    mutatePostEdit.mutate(data)
  }

  useEffect(() => {
    getPostInfo(postId)
  }, [])

  return (
    <section className='pt-5'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onEditPost)}>
          <FormItem className='mb-5'>
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder='내용을 입력해 주세요.'
                      className='resize-none h-52'
                      defaultValue={prevData?.content}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormItem>
          <FormItem className='mb-5'>
            <FormLabel className='block'>이미지 첨부(선택)</FormLabel>
            <div className='flex justify-start items-center gap-2'>
              <label className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer gap-2'>
                <Icon name='ImagePlus' />
                <span>파일 첨부</span>
                <input
                  type='file'
                  accept='image/*'
                  multiple
                  hidden
                  onChange={(e) =>
                    e.target.files && e.target.files.length > 0
                      ? fileChange(e.target.files[0])
                      : null
                  }
                />
              </label>
              <Button
                type='button'
                variant={'outline'}
                onClick={() => {
                  setImgPreview('')
                  setSelectedFile(null)
                }}
              >
                삭제
              </Button>
            </div>
            <div className='w-52 h-52 rounded-lg overflow-hidden'>
              {imgPreview ? (
                <img src={imgPreview} alt='게시글 이미지' />
              ) : (
                <div className='w-full h-full bg-slate-200 flex justify-center items-center'>
                  <Icon name='Image' />
                </div>
              )}
            </div>
          </FormItem>
          <div className='flex justify-center gap-2'>
            <Button
              type='button'
              variant={'outline'}
              onClick={() => router.back()}
            >
              취소하기
            </Button>
            <Button type='submit'>수정하기</Button>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default withAuth(EditPostPage)
