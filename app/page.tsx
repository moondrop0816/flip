'use client'

import withAuth from '@/components/hocs/withAuth'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

function Home() {
  const router = useRouter()

  return (
    <div className='container bg-slate-300 w-screen h-screen flex flex-col justify-center items-center'>
      <h1 className='text-4xl font-bold text-center mb-10'>Flip</h1>
      <Button className='w-52 mb-2' onClick={() => router.push('/login')}>
        로그인
      </Button>
      <Button
        className='w-52'
        variant={'secondary'}
        onClick={() => router.push('/signup')}
      >
        회원가입
      </Button>
    </div>
  )
}

export default withAuth(Home)
