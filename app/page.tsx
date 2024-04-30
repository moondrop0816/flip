'use client'

import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import withAuth from '@/components/hocs/withAuth'

function Home() {
  return (
    <>
      <Header />
      <div className='container'>
        <div>로그인한 유저</div>
        <div>닉네임님 환영합니다!</div>
      </div>
      <Footer isAddible={true} />
    </>
  )
}

export default withAuth(Home)
