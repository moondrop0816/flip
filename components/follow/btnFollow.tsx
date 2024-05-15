'use client'

import { useLoginUserInfo } from '@/context/loginUserInfoProvider'
import { Button } from '../ui/button'
import {
  deleteDoc,
  doc,
  getDocs,
  increment,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { followDB, userDB } from '@/firebase/firebase'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/authProvider'

export const BtnFollow = ({
  followingUserUid,
}: {
  followingUserUid: string | undefined
}) => {
  // const { loginUserInfo } = useLoginUserInfo()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  // 팔로우 로직 정리
  // 버튼의 조건부 렌더링
  // 팔로우 버튼은 로그인한 사용자가 아닌 사용자에게 나타나야 함
  // 이 사용자가 로그인한 유저의 팔로잉 목록에 없다 => 팔로우 버튼
  // 이 사용자가 로그인한 유저의 팔로잉 목록에 있다 => 언팔로우 버튼

  const { data: isFollowing } = useQuery({
    queryKey: ['isFollowing', user?.uid, followingUserUid],
    queryFn: async () => {
      const q = query(
        followDB,
        where('followerUserId', '==', user?.uid),
        where('followingUserId', '==', followingUserUid)
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot
    },
  })

  // 팔로우 로직
  // followDB에 내 아이디, 상대 아이디로 문서 생성(각자 uid로 넣어주기)
  // 내 유저 문서에 팔로잉 1 증가
  // 상대 유저 문서에 팔로워 1 증가
  const mutateFollow = useMutation({
    mutationFn: async () => {
      // 내 문서 찾기
      const myDoc = doc(userDB, user?.uid)
      // 상대 문서 찾기
      const followingDoc = doc(userDB, followingUserUid)
      // 팔로우 디비 문서 생성(자동 아이디)
      const followRef = doc(followDB)
      // 팔로우 디비 문서 수정(uid 추가)
      // 팔로우 = 내가 상대의 팔로워가 됨
      await setDoc(followRef, {
        followerUserId: user?.uid,
        followingUserId: followingUserUid,
      })
      // 내 문서 팔로잉 증가
      await updateDoc(myDoc, {
        followingCount: increment(1),
      })
      // 상대 유저 문서 팔로워 증가
      await updateDoc(followingDoc, {
        followerCount: increment(1),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user'],
      })
      queryClient.invalidateQueries({
        queryKey: ['isFollowing'],
      })
    },
  })

  // 언팔로우 로직
  // followDB에 내 아이디, 상대 아이디로 있는 문서 제거(각각 uid로 넣어주기)
  // 내 문서에 팔로잉 1 감소
  // 상대 유저 문서에 1 감소
  const mutateUnfollow = useMutation({
    mutationFn: async () => {
      // 내 문서 찾기
      const myDoc = doc(userDB, user?.uid)
      // 상대 문서 찾기
      const followingDoc = doc(userDB, followingUserUid)
      // 팔로우 디비 문서 삭제
      const q = query(
        followDB,
        where('followerUserId', '==', user?.uid),
        where('followingUserId', '==', followingUserUid)
      )
      const querySnapshot = await getDocs(q)
      const dataId = querySnapshot.docs.map((doc) => doc.id)[0]
      await deleteDoc(doc(followDB, dataId))
      // 내 문서 팔로잉 감소
      await updateDoc(myDoc, {
        followingCount: increment(-1),
      })
      // 상대 유저 팔로워 감소
      await updateDoc(followingDoc, {
        followerCount: increment(-1),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user'],
      })
      queryClient.invalidateQueries({
        queryKey: ['isFollowing'],
      })
    },
  })

  return (
    <>
      {isFollowing?.empty ? (
        <Button onClick={() => mutateFollow.mutate()}>팔로우</Button>
      ) : (
        <Button variant={'destructive'} onClick={() => mutateUnfollow.mutate()}>
          언팔로우
        </Button>
      )}
    </>
  )
}
