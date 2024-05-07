/* eslint-disable */
'use client'

import { ComponentType, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/firebase'
import { usePathname, useRouter } from 'next/navigation'

const withAuth =
  (Component: ComponentType) =>
  <P extends {}>(props: P) => {
    const router = useRouter()
    const pathName = usePathname()

    useEffect(() => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          if (pathName === '/login' || pathName === '/signup') {
            router.push('/feed')
          }
        } else {
          if (pathName !== '/login' && pathName !== '/signup') {
            router.push('/login')
          }
        }
      })
    }, [])

    return <Component {...props} />
  }

export default withAuth
