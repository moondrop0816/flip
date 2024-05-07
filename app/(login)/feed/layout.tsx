import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { FeedLastVisibleProvider } from '@/context/feedProvider'

export default function FeedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <FeedLastVisibleProvider>{children}</FeedLastVisibleProvider>
      <Footer isAddible={true} />
    </>
  )
}
