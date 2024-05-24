'use client'

import { UserCard } from '@/components/follow/userCard'
import Icon from '@/components/icon'
import { userDB } from '@/firebase/firebase'
import { debounce } from '@/utils/debounce'
import { getDocs, query, where } from 'firebase/firestore'
import { useState } from 'react'

const SearchPage = () => {
  const [keyword, setKeyword] = useState('')
  const [searchData, setSearchData] = useState<string[]>([])

  const debounceSearch = debounce(async (keyword) => {
    if (keyword) {
      console.log(keyword)

      const userQ = query(
        userDB,
        where('userId', '>=', keyword),
        where('userId', '<=', keyword + '\uf8ff')
      )
      const nicknameQ = query(
        userDB,
        where('nickname', '>=', keyword),
        where('nickname', '<=', keyword + '\uf8ff')
      )
      const userSnap = await getDocs(userQ)
      const nicknameSnap = await getDocs(nicknameQ)
      const userData = userSnap.docs.map((doc) => doc.id)
      const nickData = nicknameSnap.docs.map((doc) => doc.id)
      setSearchData([...userData, ...nickData])
    } else {
      setSearchData([])
    }

    console.log(searchData)
  }, 500)

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
    debounceSearch(e.target.value)
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
          onChange={(e) => onSearch(e)}
        />
      </div>
      <div>
        {searchData.map((data) => {
          return <UserCard key={data} userUid={data} />
        })}
      </div>
    </section>
  )
}

export default SearchPage
