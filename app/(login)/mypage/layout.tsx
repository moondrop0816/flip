import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'

export default function MypageLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <div className='container pt-8 pb-24'>{children}</div>
      <Footer />
    </>
  )
}
