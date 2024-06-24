import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import Icon from '@/components/icon'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { storage, userDB } from '@/firebase/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { DocumentData, getDocs, query, where } from 'firebase/firestore'
import { useLoginUserInfo } from '@/context/loginUserInfoProvider'

const formSchema = z.object({
  userId: z
    .string({
      required_error: '아이디를 입력해 주세요.',
    })
    .min(4, {
      message: '4자 ~ 16자 이상의 영문 소문자, 숫자, 밑줄(_)을 사용해 주세요.',
    })
    .max(16)
    .regex(/^[a-z0-9_]{4,16}$/, {
      message: '올바른 아이디 형식이 아닙니다.',
    }),
  nickname: z
    .string({
      required_error: '닉네임을 입력해 주세요.',
    })
    .min(2, {
      message: '닉네임은 최소 2글자 이상이어야 합니다.',
    })
    .max(100),
  bio: z
    .string({
      required_error: '자기소개를 입력해 주세요.',
    })
    .max(200),
})

export const ModalProfileEdit = () => {
  const { loginUserInfo } = useLoginUserInfo()
  const [imgPreview, setImgPreview] = useState(loginUserInfo?.profileImg)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   userId: loginUserInfo?.userId || '',
    //   nickname: loginUserInfo?.nickname || '',
    //   bio: loginUserInfo?.bio || '',
    // },
  })

  useEffect(() => {
    if (loginUserInfo) {
      setImgPreview(loginUserInfo.profileImg || '')
      form.reset({
        userId: loginUserInfo.userId || '',
        nickname: loginUserInfo.nickname || '',
        bio: loginUserInfo.bio || '',
      })
    }
  }, [loginUserInfo, form])

  const imageUpload = async (uid: string) => {
    if (selectedFile) {
      // 선택한 프로필 이미지가 있으면
      const imageRef = ref(storage, `${uid}/${selectedFile.name}`)
      await uploadBytes(imageRef, selectedFile)
      const downloadURL = await getDownloadURL(imageRef)
      return downloadURL
    } else {
      // 기본 프로필 이미지 주소 리턴
      const defaultURL = await getDownloadURL(
        ref(storage, '/defaultProfile.png')
      )
      return defaultURL
    }
  }

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

  const userIdCheck = async () => {
    const value = form.getValues('userId')
    // 유효성 검증을 통과했을때만 중복 검사 실행
    if (!form.getFieldState('userId').invalid) {
      const q = query(userDB, where('userId', '==', value))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map((doc) => doc.data())[0]

      // 중복된 값이 있다면
      if (data) {
        alert(`이미 사용중인 아이디 입니다.`)
        form.setValue('userId', '')
      } else {
        alert(`사용 가능한 아이디 입니다.`)
      }
    }
  }

  const onEditProfile = async () => {
    console.log('edit')
  }

  return (
    <Dialog>
      {/* <DialogTrigger>
        <Button variant='outline'>프로필 수정</Button>
      </DialogTrigger> */}
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onEditProfile)}>
            <div className='mb-5 flex justify-center relative'>
              <div className='rounded-full overflow-hidden w-1/5'>
                <img src={imgPreview} alt='프로필 이미지' />
              </div>
              <label className='bg-black flex self-end rounded-full p-3 cursor-pointer absolute left-[calc(50%+40px)]'>
                <Icon name='ImagePlus' color='#fff' />
                <input
                  type='file'
                  accept='image/*'
                  hidden={true}
                  onChange={(e) =>
                    e.target.files && e.target.files.length > 0
                      ? fileChange(e.target.files[0])
                      : null
                  }
                />
              </label>
            </div>
            <div className='mb-2'>
              <FormField
                control={form.control}
                name='userId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>아이디</FormLabel>
                    <div className='flex gap-2'>
                      <FormControl>
                        <Input type='text' placeholder='userId' {...field} />
                      </FormControl>
                      <Button
                        type='button'
                        onClick={userIdCheck}
                        disabled={
                          !form.getFieldState('userId').isDirty ||
                          form.getFieldState('userId').invalid
                        }
                      >
                        중복 확인
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='mb-2'>
              <FormField
                control={form.control}
                name='nickname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>닉네임</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='닉네임을 입력해 주세요.'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='mb-8'>
              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>자기소개</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='자기소개를 입력해 주세요.'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type='submit'
              className='w-full text-lg h-12'
              disabled={
                !form.formState.isValid ||
                Object.keys(form.formState.dirtyFields).length === 0
              }
            >
              저장하기
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
