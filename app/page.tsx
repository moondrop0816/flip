'use client'

import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

function Home() {
  return (
    <>
      <Header />
      <div>홈</div>
      <Footer isAddible={true} />
    </>
  )
}

export default Home
