import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import { FeedLastVisibleProvider } from '@/context/feedProvider'
import { FollowFeedLastVisibleProvider } from '@/context/followFeedProvider'
import { LoginUserInfoProvider } from '@/context/loginUserInfoProvider'

export default function FeedLayout({
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
            {children}
          </FollowFeedLastVisibleProvider>
        </FeedLastVisibleProvider>
        <Footer isAddible={true} />
      </LoginUserInfoProvider>
    </>
  )
}
