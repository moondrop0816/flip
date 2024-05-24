import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { LoginUserInfoProvider } from '@/context/loginUserInfoProvider'

export default function SearchLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <LoginUserInfoProvider>
        <Header />
        <div className='container pt-8 pb-24'>{children}</div>
        <Footer />
      </LoginUserInfoProvider>
    </>
  )
}
