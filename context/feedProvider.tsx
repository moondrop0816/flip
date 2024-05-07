'use client'

import { LastVisibleContextType } from '@/types/post'
import { DocumentData } from 'firebase/firestore'
import React, { createContext, useState, useContext, ReactNode } from 'react'

// Context 생성
const FeedLastVisibleContext = createContext<
  LastVisibleContextType | undefined
>(undefined)

// Context Provider
export const FeedLastVisibleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [lastVisible, setLastVisible] = useState<
    number | DocumentData | undefined
  >(undefined)

  return (
    <FeedLastVisibleContext.Provider value={{ lastVisible, setLastVisible }}>
      {children}
    </FeedLastVisibleContext.Provider>
  )
}

// Custom Hook
export const useFeedLastVisible = (): LastVisibleContextType => {
  const context = useContext(FeedLastVisibleContext)
  if (!context) {
    throw new Error('useLastVisible must be used within a LastVisibleProvider')
  }
  return context
}
