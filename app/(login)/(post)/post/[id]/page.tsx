import PostCard from '@/components/post/postCard'
import ReplyWrapper from '@/components/post/replyWrapper'
import { db } from '@/firebase/firebase'
import { ReplyLastVisibleProvider } from '@/context/replyProvider'
import { Post } from '@/types/post'
import { doc, getDoc } from 'firebase/firestore'

const getPostInfo = async (postId: string) => {
  const docRef = doc(db, 'feed', postId)
  const docSnap = await getDoc(docRef)
  const data: Post = {
    userUid: docSnap.data()?.userUid,
    content: docSnap.data()?.content,
    commentCount: docSnap.data()?.commentCount,
    likeCount: docSnap.data()?.likeCount,
    createdAt: docSnap.data()?.createdAt.toDate(),
    updatedAt: docSnap.data()?.updatedAt.toDate(),
    imageUrl: docSnap.data()?.imageUrl,
  }

  return data
}

const PostDetailPage = async ({
  params: { id },
}: {
  params: { id: string }
}) => {
  const data = await getPostInfo(id)

  return (
    <section>
      <PostCard id={id} data={data} />
      <ReplyLastVisibleProvider>
        <ReplyWrapper feedId={id} />
      </ReplyLastVisibleProvider>
    </section>
  )
}

export default PostDetailPage
