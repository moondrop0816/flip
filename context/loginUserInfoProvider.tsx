'use client'

import { CurrentLoginUserInfo, LoginUserInfoContextType } from '@/types/user'
import React, { ReactNode, createContext, useContext, useState } from 'react'

// Context 생성
const LoginUserInfoContext = createContext<
  LoginUserInfoContextType | undefined
>(undefined)

// Context Provider
export const LoginUserInfoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loginUserInfo, setLoginUserInfo] = useState<
    CurrentLoginUserInfo | undefined
  >(undefined)

  return (
    <LoginUserInfoContext.Provider value={{ loginUserInfo, setLoginUserInfo }}>
      {children}
    </LoginUserInfoContext.Provider>
  )
}

// Custom Hook
export const useLoginUserInfo = (): LoginUserInfoContextType => {
  const context = useContext(LoginUserInfoContext)
  if (!context) {
    throw new Error(
      'useLoginUserInfo must be used within a LoginUserInfoProvider'
    )
  }
  return context
}
