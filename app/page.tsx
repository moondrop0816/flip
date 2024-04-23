'use client'

import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from '@/firebase/firebase'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { collection, getDocs, query, where } from 'firebase/firestore'

export default function Home() {
  const router = useRouter()
  const userCheck = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const id = user.uid
        console.log('uid', id)
        const q = query(collection(db, 'user'), where('id', '==', id))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          console.log(doc.data())
        })
      } else {
        // User is signed out
        console.log('logout')
        router.push('/login')
      }
    })
  }

  const onLogout = async () => {
    console.log('logout event')
    await signOut(auth)
  }

  useEffect(() => {
    userCheck()
  }, [])

  return (
    <main>
      <div>로그인한 유저</div>
      <div>닉네임님 환영합니다!</div>
      <button type='button' onClick={onLogout}>
        logout
      </button>
    </main>
  )
}
