'use client'

import { LastVisibleContextType } from '@/types/post'
import { DocumentData } from 'firebase/firestore'
import React, { createContext, useState, useContext, ReactNode } from 'react'

// Context 생성
const ReplyLastVisibleContext = createContext<
  LastVisibleContextType | undefined
>(undefined)

// Context Provider
export const ReplyLastVisibleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [lastVisible, setLastVisible] = useState<
    number | DocumentData | undefined
  >(undefined)

  return (
    <ReplyLastVisibleContext.Provider value={{ lastVisible, setLastVisible }}>
      {children}
    </ReplyLastVisibleContext.Provider>
  )
}

// Custom Hook
export const useReplyLastVisible = (): LastVisibleContextType => {
  const context = useContext(ReplyLastVisibleContext)
  if (!context) {
    throw new Error('useLastVisible must be used within a LastVisibleProvider')
  }
  return context
}
