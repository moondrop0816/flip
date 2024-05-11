'use client'

import { LastVisibleContextType } from '@/types/post'
import { DocumentData } from 'firebase/firestore'
import React, { ReactNode, createContext, useContext, useState } from 'react'

// Context 생성
const FollowFeedLastVisibleContext = createContext<
  LastVisibleContextType | undefined
>(undefined)

// Context Provider
export const FollowFeedLastVisibleProvider: React.FC<{
  children: ReactNode
}> = ({ children }) => {
  const [lastVisible, setLastVisible] = useState<
    number | DocumentData | undefined
  >(undefined)

  return (
    <FollowFeedLastVisibleContext.Provider
      value={{ lastVisible, setLastVisible }}
    >
      {children}
    </FollowFeedLastVisibleContext.Provider>
  )
}

// Custom Hook
export const useFollowFeedLastVisible = (): LastVisibleContextType => {
  const context = useContext(FollowFeedLastVisibleContext)
  if (!context) {
    throw new Error(
      'useFollowFeedLastVisible must be used within a FollowFeedLastVisibleProvider'
    )
  }
  return context
}
