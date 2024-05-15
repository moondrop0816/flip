import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { FeedLastVisibleProvider } from '@/context/feedProvider'
import { FollowFeedLastVisibleProvider } from '@/context/followFeedProvider'
import { LoginUserInfoProvider } from '@/context/loginUserInfoProvider'

export default function PostLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <LoginUserInfoProvider>
        <Header />
        <FeedLastVisibleProvider>
          <FollowFeedLastVisibleProvider>
            <div className='container pt-8 pb-24'>{children}</div>
          </FollowFeedLastVisibleProvider>
        </FeedLastVisibleProvider>
        <Footer />
      </LoginUserInfoProvider>
    </>
  )
}
