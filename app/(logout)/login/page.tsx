'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { LoginInfo } from '../../../types/user'
import { auth } from '@/firebase/firebase'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'
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
import { useEffect } from 'react'
import Link from 'next/link'
import withAuth from '@/components/hocs/withAuth'

const formSchema = z.object({
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
  password: z.string({
    required_error: '비밀번호를 입력해 주세요.',
  }),
})

const Login = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const router = useRouter()

  const onLogin: SubmitHandler<LoginInfo> = async () => {
    const [email, password] = form.getValues(['email', 'password'])
    await signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        alert('로그인 성공')
        router.push('/')
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/user-not-found' || 'auth/wrong-password':
            alert('이메일 혹은 비밀번호가 일치하지 않습니다.')
            break
          case 'auth/network-request-failed':
            alert('네트워크 연결에 실패 하였습니다.')
            break
          case 'auth/internal-error':
            alert('잘못된 요청입니다.')
            break
          default:
            alert('로그인에 실패 하였습니다.')
        }
      })
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => (user ? router.push('/') : null))
  }, [])

  return (
    <section className='py-16'>
      <h1 className='text-4xl font-bold text-center mb-10'>Flip</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onLogin)}>
          <div className='mb-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이메일</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='example@naver.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='mb-10'>
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
          <Button type='submit' className='w-full text-lg h-12'>
            로그인
          </Button>
        </form>
      </Form>
      <Link
        href={'/signup'}
        className='h-12 mt-5 inline-block flex justify-center'
      >
        회원가입
      </Link>
    </section>
  )
}

export default withAuth(Login)
