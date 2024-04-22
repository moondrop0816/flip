'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/firebase'
import { useState } from 'react'

interface UserInfo {
  email: string
  password: string
  passwordCheck: string
  nickname: string
  bio: string
  profileImg: string
}

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<UserInfo>({ mode: 'onChange' })

  const [imgSrc, setImgSrc] = useState('./next.svg')

  const fileChange = (fileBlob: File) => {
    const reader = new FileReader()
    reader.readAsDataURL(fileBlob)
    return new Promise((resolve) => {
      reader.onload = () => {
        setImgSrc(reader.result as string)
        resolve(null)
      }
    })
  }

  const onSubmit: SubmitHandler<UserInfo> = (data) => {
    event?.preventDefault()
    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((useCredential) => {
        console.log(useCredential)
        // 회원가입이 되면 생성된 정보로 유저 테이블에 정보 덮어쓰기
        // 닉네임, 프로필이미지 변경
        // 바이오는 유저 테이블에 추가
      })
      .catch((err) => console.log(err))
  }

  return (
    <section>
      <h1>Flip</h1>
      <div>프로필 이미지 영역</div>
      <button type='button'>프로필 이미지 추가버튼</button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <img src={imgSrc} alt='프로필 이미지' />
          <input
            type='file'
            accept='image/*'
            onChange={(e) =>
              e.target.files && e.target.files.length > 0
                ? fileChange(e.target.files[0])
                : null
            }
          />
        </div>
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
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/,
                message: '올바른 이메일 형식이 아닙니다.',
              },
            })}
          />
          <button type='button'>중복 확인</button>
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
              maxLength: 100,
              pattern: {
                value: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,}$/,
                message:
                  '8자 이상의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.',
              },
            })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div>
          <label htmlFor='passwordCheck'>비밀번호 확인</label>
          <input
            type='password'
            id='passwordCheck'
            placeholder='●●●●●●●●'
            {...register('passwordCheck', {
              required: {
                value: true,
                message: '비밀번호 확인을 입력해 주세요.',
              },
              validate: {
                matchPassword: (value) => {
                  const { password } = getValues()
                  return password === value || '비밀번호가 일치하지 않습니다.'
                },
              },
            })}
          />
          {errors.passwordCheck && <p>{errors.passwordCheck?.message}</p>}
        </div>
        <div>
          <label htmlFor='nickname'>닉네임</label>
          <input
            type='text'
            id='nickname'
            placeholder='닉네임'
            {...register('nickname', {
              required: {
                value: true,
                message: '닉네임을 입력해 주세요.',
              },
              minLength: {
                value: 2,
                message: '닉네임은 최소 2글자 이상이어야 합니다.',
              },
              maxLength: 200,
            })}
          />
          {errors.nickname && <p>{errors.nickname?.message}</p>}
        </div>
        <div>
          <label htmlFor='bio'>자기소개</label>
          <input
            type='text'
            id='bio'
            placeholder='자기소개를 입력해주세요'
            {...register('bio', {
              required: {
                value: true,
                message: '자기소개를 입력해 주세요.',
              },
              maxLength: 200,
            })}
          />
          {errors.bio && <p>{errors.bio?.message}</p>}
        </div>
        <button type='submit'>가입하기</button>
      </form>
    </section>
  )
}

export default SignUp
