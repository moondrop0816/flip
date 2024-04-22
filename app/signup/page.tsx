'use client'

import { useForm, SubmitHandler, FieldErrors } from 'react-hook-form'

interface UserInfo {
  email: string
  password: string
  passwordCheck: string
  nickname: string
  bio: string
}

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInfo>()

  console.log(errors)

  const onSubmit: SubmitHandler<UserInfo> = (data) => {
    console.log(data)
  }

  const onError = (err: FieldErrors) => {
    console.log(err)
  }

  return (
    <section>
      <h1>Flip</h1>
      <div>프로필 이미지 영역</div>
      <button type='button'>프로필 이미지 추가버튼</button>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
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
          <p>이미 사용중인 이메일입니다.</p>
          <p>사용 가능한 이메일입니다.</p>
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
              minLength: {
                value: 10,
                message:
                  '10자 이상의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.',
              },
              maxLength: 100,
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*d|(?=.*[W_]))[A-Za-zdW_]*$/,
                message:
                  '10자 이상의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.',
              },
            })}
          />
        </div>
        <div>
          <label htmlFor='passwordCheck'>비밀번호 확인</label>
          <input
            type='text'
            id='passwordCheck'
            placeholder='●●●●●●●●'
            {...register('passwordCheck', {
              required: {
                value: true,
                message: '비밀번호 확인을 입력해 주세요.',
              },
            })}
          />
          <p>비밀번호가 일치하지 않습니다.</p>
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
        </div>
        <button type='submit'>가입하기</button>
      </form>
    </section>
  )
}

export default SignUp
