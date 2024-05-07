'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db, storage } from '@/firebase/firebase'
import {
  collection,
  setDoc,
  doc,
  where,
  query,
  getDocs,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useState } from 'react'
import { UserInfo } from '@/types/user'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Icon from '@/components/icon'
import { useRouter } from 'next/navigation'
import withAuth from '@/components/hocs/withAuth'

const formSchema = z
  .object({
    userId: z
      .string({
        required_error: '아이디를 입력해 주세요.',
      })
      .min(4, {
        message:
          '4자 ~ 16자 이상의 영문 소문자, 숫자, 밑줄(_)을 사용해 주세요.',
      })
      .max(16)
      .regex(/^[a-z0-9_]{4,16}$/, {
        message: '올바른 아이디 형식이 아닙니다.',
      }),
    email: z
      .string({
        required_error: '이메일을 입력해 주세요.',
      })
      .regex(
        /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
        {
          message: '올바른 이메일 형식이 아닙니다.',
        }
      ),
    password: z
      .string({
        required_error: '비밀번호를 입력해 주세요.',
      })
      .min(8, {
        message: '8자 이상의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.',
      })
      .max(100)
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,}$/, {
        message: '8자 이상의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.',
      }),
    passwordCheck: z.string({
      required_error: '비밀번호 확인을 입력해 주세요.',
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
  .refine((data) => data.password === data.passwordCheck, {
    path: ['passwordCheck'],
    message: '비밀번호가 일치하지 않습니다.',
  })

const SignUp = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: '',
      email: '',
      password: '',
      passwordCheck: '',
      nickname: '',
      bio: '',
    },
  })
  const router = useRouter()
  const [imgPreview, setImgPreview] = useState('./defaultProfile.png')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const imageUpload = async (userId: string) => {
    if (selectedFile) {
      // 선택한 프로필 이미지가 있으면
      const imageRef = ref(storage, `${userId}/${selectedFile.name}`)
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

  const duplicateCheck = async (type: 'email' | 'userId') => {
    const value = form.getValues(type)
    const label = type === 'email' ? '이메일' : '아이디'
    // 유효성 검증을 통과했을때만 중복 검사 실행
    if (!form.getFieldState(type).invalid) {
      const q = query(collection(db, 'user'), where(type, '==', value))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map((doc) => doc.data())[0]

      // 중복된 값이 있다면
      if (data) {
        alert(`이미 사용중인 ${label} 입니다.`)
        form.setValue(type, '')
      } else {
        alert(`사용 가능한 ${label} 입니다.`)
      }
    }
  }

  const onSubmit: SubmitHandler<UserInfo> = async (
    data: z.infer<typeof formSchema>
  ) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    )
    const uid = credential.user.uid
    const profileImgUrl = await imageUpload(data.userId)
    const userDB = collection(db, 'user')
    const userDoc = doc(userDB, uid)
    await setDoc(userDoc, {
      uid: uid,
      userId: data.userId,
      email: data.email,
      nickname: data.nickname,
      bio: data.bio,
      createdAt: new Date(),
      profileImg: profileImgUrl,
    })
    alert('가입성공')
    router.push('/feed')
  }

  return (
    <section className='py-16'>
      <h1 className='text-4xl font-bold text-center mb-10'>Flip</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      onClick={() => duplicateCheck('userId')}
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
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <div className='flex gap-2'>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='example@naver.com'
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type='button'
                      onClick={() => duplicateCheck('email')}
                      disabled={
                        !form.getFieldState('email').isDirty ||
                        form.getFieldState('email').invalid
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
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='●●●●●●●●' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='mb-2'>
            <FormField
              control={form.control}
              name='passwordCheck'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호 확인</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='●●●●●●●●' {...field} />
                  </FormControl>
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
            가입하기
          </Button>
        </form>
      </Form>
    </section>
  )
}

export default withAuth(SignUp)
