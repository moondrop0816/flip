import PostCard from '@/components/post/postCard'
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
      <div>댓글 영역. 댓글 개별 컴포넌트를 감싸는 댓글 wrap 컴포넌트</div>
    </section>
  )
}

export default PostDetailPage
