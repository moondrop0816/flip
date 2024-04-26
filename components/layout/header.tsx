import Link from 'next/link'
import { Button } from '../ui/button'

const Header = () => {
  return (
    <header className='bg-slate-300 shadow-md flex flex-wrap justify-between items-center px-5 py-3 sticky'>
      <div className='basis-1/3 text-left'>
        <div className='rounded-full overflow-hidden w-10'>
          <img
            src='https://firebasestorage.googleapis.com/v0/b/flip-fb254.appspot.com/o/3OCYbv1g8shEE1k7N8faT7jjZkm1%2F1610707726106.jpg?alt=media&token=515075ef-17fa-4400-b462-cf45de81f395'
            alt='프로필 이미지'
          />
        </div>
      </div>
      <div className='basis-1/3 text-center'>
        <Link href={'/'}>
          <h1 className='text-4xl font-bold'>Flip</h1>
        </Link>
      </div>
      <div className='basis-1/3 self-end text-right'>
        <Button variant={'ghost'}>
          <Link href={'/login'}>로그인</Link>
        </Button>
      </div>
    </header>
  )
}

export default Header
