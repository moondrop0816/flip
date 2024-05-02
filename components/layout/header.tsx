'use client'

import Link from 'next/link'
import { Button } from '../ui/button'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from '@/firebase/firebase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, getDocs, query, where } from 'firebase/firestore'

const Header = () => {
  const [loginUser, setLoginUser] = useState({
    userId: '',
    profileImg: './defaultProfile.png',
  })
  const router = useRouter()
  const userCheck = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid
        const q = query(collection(db, 'user'), where('uid', '==', uid))
        const querySnapshot = await getDocs(q)
        const data = querySnapshot.docs.map((doc) => doc.data())[0]
        setLoginUser({ userId: data.userId, profileImg: data.profileImg })
      } else {
        setLoginUser({ userId: '', profileImg: './defaultProfile.png' })
        router.push('/login')
      }
    })
  }

  const onLogout = async () => {
    await signOut(auth)
    router.push('/login')
  }

  useEffect(() => {
    userCheck()
  }, [])

  return (
    <header className='bg-slate-300 shadow-md flex flex-wrap justify-between items-center px-5 py-3 sticky'>
      <div className='basis-1/3 text-left'>
        <div className='rounded-full overflow-hidden w-10'>
          <Link href={`/mypage/${loginUser.userId}`} scroll={false}>
            <img src={loginUser.profileImg} alt='프로필 이미지' />
          </Link>
        </div>
      </div>
      <div className='basis-1/3 text-center'>
        <Link href={'/'} scroll={false}>
          <h1 className='text-4xl font-bold'>Flip</h1>
        </Link>
      </div>
      <div className='basis-1/3 self-end text-right'>
        {loginUser.userId ? (
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
