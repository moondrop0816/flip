'use client'

import { auth } from '@/firebase/firebase'
import { User, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'

export default function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return { user, loading }
}
