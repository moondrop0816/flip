'use client'

import { UserCard } from '@/components/follow/userCard'
import Icon from '@/components/icon'
import { userDB } from '@/firebase/firebase'
import { getDocs, or, query, where } from 'firebase/firestore'
import { useState } from 'react'

const SearchPage = () => {
  const [keyword, setKeyword] = useState('')
  const [searchData, setSearchData] = useState<string[]>([])
  // 1. 버튼 누르면 구현되는 방식으로 먼저 구현
  // 2. 자동완성으로 바꾸기
  const onSearch = async () => {
    // 검색 함수
    // 1. 클릭시 keyword로 검색하기
    // 2. 파이어베이스로 요청 보내기
    // 3. userDB에 해당 키워드랑 일치하는 닉네임 있는지? 유저 아이디 있는지? 체크해서 결과 리턴
    // 유저 검색이니까 일단은 닉네임 + 유저 아이디로만 검색되게 하기
    const q = query(
      userDB,
      or(
        where('userId', '>=', keyword),
        where('userId', '<=', keyword + '\uf8ff'),
        where('nickname', '>=', keyword),
        where('nickname', '<=', keyword + '\uf8ff')
      )
    )
    const querySnapshot = await getDocs(q)
    const data = querySnapshot.docs.map((doc) => doc.id)
    console.log(data)

    setSearchData(data)
  }

  return (
    <section>
      <div className='flex items-center bg-slate-200 p-2 rounded-md gap-2 mb-5'>
        <Icon name='Search' />
        <input
          type='text'
          placeholder='검색어를 입력해주세요'
          className='grow bg-transparent'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <button type='button' onClick={onSearch}>
        검색
      </button>
      <div>
        {searchData.map((data) => {
          return <UserCard key={data} userUid={data} />
        })}
      </div>
    </section>
  )
}

export default SearchPage
