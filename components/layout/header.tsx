'use client'

import Link from 'next/link'
import { Button } from '../ui/button'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from '@/firebase/firebase'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { UserInfo } from '@/types/user'

const Header = () => {
  const router = useRouter()
  const userCheck = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid
        const q = query(collection(db, 'user'), where('uid', '==', uid))
        const querySnapshot = await getDocs(q)
        const data = querySnapshot.docs.map((doc) => doc.data())[0]
        if (!localStorage.getItem('currentUser')) {
          localStorage.setItem('currentUser', JSON.stringify(data))
        }
      } else {
        // User is signed out
        localStorage.removeItem('currentUser')
        router.push('/login')
      }
    })
  }

  const currentUser = localStorage.getItem('currentUser') || ''
  const currentData: UserInfo = JSON.parse(currentUser)

  const onLogout = async () => {
    await signOut(auth)
    localStorage.removeItem('currentUser')
  }

  useEffect(() => {
    userCheck()
  }, [])

  return (
    <header className='bg-slate-300 shadow-md flex flex-wrap justify-between items-center px-5 py-3 sticky'>
      <div className='basis-1/3 text-left'>
        <div className='rounded-full overflow-hidden w-10'>
          {currentData && (
            <img src={currentData.profileImg} alt='프로필 이미지' />
          )}
        </div>
      </div>
      <div className='basis-1/3 text-center'>
        <Link href={'/'}>
          <h1 className='text-4xl font-bold'>Flip</h1>
        </Link>
      </div>
      <div className='basis-1/3 self-end text-right'>
        {currentData ? (
          <Button variant={'ghost'} onClick={onLogout}>
            <Link href={'/login'}>로그아웃</Link>
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
