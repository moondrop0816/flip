import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { FeedLastVisibleProvider } from '@/context/feedProvider'

export default function PostLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <FeedLastVisibleProvider>
        <div className='container pt-8 pb-24'>{children}</div>
      </FeedLastVisibleProvider>
      <Footer />
    </>
  )
}
