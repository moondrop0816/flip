'use client'

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
  const { user } = useAuth()
  const queryClient = useQueryClient()

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

  const mutateFollow = useMutation({
    mutationFn: async () => {
      const myDoc = doc(userDB, user?.uid)
      const followingDoc = doc(userDB, followingUserUid)
      const followRef = doc(followDB)
      await setDoc(followRef, {
        followerUserId: user?.uid,
        followingUserId: followingUserUid,
      })
      await updateDoc(myDoc, {
        followingCount: increment(1),
      })
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

  const mutateUnfollow = useMutation({
    mutationFn: async () => {
      const myDoc = doc(userDB, user?.uid)
      const followingDoc = doc(userDB, followingUserUid)
      const q = query(
        followDB,
        where('followerUserId', '==', user?.uid),
        where('followingUserId', '==', followingUserUid)
      )
      const querySnapshot = await getDocs(q)
      const dataId = querySnapshot.docs.map((doc) => doc.id)[0]
      await deleteDoc(doc(followDB, dataId))
      await updateDoc(myDoc, {
        followingCount: increment(-1),
      })
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
