'use client'

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/firebase'
import { SyncLoader } from 'react-spinners'

interface AuthContextType {
  user: User | null
  setUser: Dispatch<SetStateAction<User | null>>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setInitialized(true)
    })

    return () => {
      unsubscribe()
    }
  }, [setInitialized, setUser])

  if (initialized === false) {
    return <SyncLoader />
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}
