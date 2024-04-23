'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { LoginInfo } from '../../types/user'
import { auth } from '@/firebase/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginInfo>()
  const router = useRouter()

  const onLogin: SubmitHandler<LoginInfo> = async () => {
    console.log('login')
    event?.preventDefault()
    const [email, password] = getValues(['email', 'password'])
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        // const user = userCredential.user
        // console.log(user)
        alert('로그인 성공')
        router.push('/')
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode)
        console.log(errorMessage)
        alert('로그인 실패')
      })
  }

  return (
    <div>
      <h1>로고</h1>
      <form onSubmit={handleSubmit(onLogin)}>
        <div>
          <label htmlFor='email'>이메일</label>
          <input
            type='email'
            id='email'
            placeholder='example@naver.com'
            {...register('email', {
              required: {
                value: true,
                message: '이메일을 입력해 주세요.',
              },
              pattern: {
                value:
                  /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
                message: '올바른 이메일 형식이 아닙니다.',
              },
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor='password'>비밀번호</label>
          <input
            type='password'
            id='password'
            placeholder='●●●●●●●●'
            {...register('password', {
              required: {
                value: true,
                message: '비밀번호를 입력해 주세요.',
              },
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button type='submit'>로그인</button>
      </form>
    </div>
  )
}

export default Login
