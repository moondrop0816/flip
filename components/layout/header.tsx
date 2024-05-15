'use client'

import Link from 'next/link'
import { Button } from '../ui/button'
import { signOut } from 'firebase/auth'
import { auth, userDB } from '@/firebase/firebase'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { useLoginUserInfo } from '@/context/loginUserInfoProvider'
import { useAuth } from '@/context/authProvider'

const Header = () => {
  const router = useRouter()
  const { loginUserInfo, setLoginUserInfo } = useLoginUserInfo()
  const { user } = useAuth()

  const getLoginUser = async () => {
    const docRef = doc(userDB, user?.uid)
    const data = await (await getDoc(docRef)).data()
    setLoginUserInfo({
      userId: data?.userId,
      email: data?.email,
      nickname: data?.nickname,
      bio: data?.bio,
      profileImg: data?.profileImg,
      followerCount: data?.followerCount,
      followingCount: data?.followingCount,
    })
  }

  const onLogout = async () => {
    await signOut(auth)
    router.push('/login')
  }

  useEffect(() => {
    getLoginUser()
  }, [])

  return (
    <header className='bg-slate-300 shadow-md flex flex-wrap justify-between items-center px-5 py-3 sticky'>
      <div className='basis-1/3 text-left'>
        <div className='rounded-full overflow-hidden w-10'>
          <Link href={`/${loginUserInfo?.userId}`} scroll={false}>
            <img src={loginUserInfo?.profileImg} alt='프로필 이미지' />
          </Link>
        </div>
      </div>
      <div className='basis-1/3 text-center'>
        <Link href={'/feed'} scroll={false}>
          <h1 className='text-4xl font-bold'>Flip</h1>
        </Link>
      </div>
      <div className='basis-1/3 self-end text-right'>
        {loginUserInfo?.userId ? (
          <Button variant={'ghost'} onClick={onLogout}>
            로그아웃
          </Button>
        ) : (
          <Button variant={'ghost'}>
            <Link href={'/login'}>로그인</Link>
          </Button>
        )}
      </div>
    </header>
  )
}

export default Header
