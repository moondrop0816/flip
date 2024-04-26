import { db } from '@/firebase/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { UserInfo } from '../../../types/user'

const getUserInfo = async (id: string) => {
  const q = query(collection(db, 'user'), where('id', '==', id))
  const querySnapshot = await getDocs(q)
  const data = querySnapshot.docs.map((doc) => doc.data())[0]
  const userInfo: UserInfo = {
    email: data.email,
    password: data.password,
    passwordCheck: data.passwordCheck,
    nickname: data.nickname,
    bio: data.bio,
    profileImg: data.profileImg,
    createdAt: data.createdAt,
  }

  return userInfo
}

const MyPage = async ({ params: { id } }: { params: { id: string } }) => {
  const userInfo = await getUserInfo(id)

  return (
    <div>
      <h2>마이페이지{id}</h2>
      <div>
        <img src={userInfo.profileImg} />
        <div>{userInfo.nickname}</div>
        <div>{userInfo.email}</div>
        <div>{userInfo.bio}</div>
      </div>
    </div>
  )
}

export default MyPage
