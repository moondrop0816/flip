import PostCard from '@/components/post/postCard'
import ReplyWrapper from '@/components/post/replyWrapper'
import { db } from '@/firebase/firebase'
import { Post } from '@/types/post'
import { doc, getDoc } from 'firebase/firestore'

const getPostInfo = async (postId: string) => {
  const docRef = doc(db, 'feed', postId)
  const docSnap = await getDoc(docRef)
  const data: Post = {
    userId: docSnap.data()?.userId,
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
      <ReplyWrapper feedId={id} commentCount={data.commentCount} />
    </section>
  )
}

export default PostDetailPage
