import { db } from '@/firebase/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { MypageInfo } from '@/types/user'
import { Button } from '@/components/ui/button'
import Icon from '@/components/icon'

const getUserInfo = async (userId: string) => {
  const q = query(collection(db, 'user'), where('userId', '==', userId))
  const querySnapshot = await getDocs(q)
  const data = querySnapshot.docs.map((doc) => doc.data())[0]
  const userInfo: MypageInfo = {
    userId: data.userId,
    nickname: data.nickname,
    bio: data.bio,
    profileImg: data.profileImg,
  }

  return userInfo
}

const MyPage = async ({
  params: { userId },
}: {
  params: { userId: string }
}) => {
  const userInfo = await getUserInfo(userId)

  return (
    <section>
      <div>
        <div className='flex justify-between items-start'>
          <div className='rounded-full overflow-hidden w-1/6 mb-5'>
            <img src={userInfo.profileImg} />
          </div>
          <div className='flex items-center gap-1'>
            <Button>
              <Icon name='Send' className='mr-2 h-4 w-4' />
              DM
            </Button>
            <Button>프로필 수정</Button>
          </div>
        </div>
        <p className='text-lg font-bold'>{userInfo.nickname}</p>
        <p className='text-gray-500 mb-2'>{`@${userInfo.userId}`}</p>
        <p>{userInfo.bio}</p>
      </div>
    </section>
  )
}

export default MyPage