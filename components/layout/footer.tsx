import Link from 'next/link'
import Icon from '../icon'

const Footer = () => {
  return (
    <footer className='bg-slate-300 fixed w-screen bottom-0'>
      <nav>
        <ul className='flex flex-wrap items-center'>
          <li className='basis-1/4 '>
            <Link href={'/'} className='flex justify-center p-5'>
              <Icon name='Home' />
            </Link>
          </li>
          <li className='basis-1/4 '>
            <Link href={'/'} className='flex justify-center p-5'>
              <Icon name='Search' />
            </Link>
          </li>
          <li className='basis-1/4 '>
            <Link href={'/'} className='flex justify-center p-5'>
              <Icon name='Mail' />
            </Link>
          </li>
          <li className='basis-1/4 '>
            <Link href={'/'} className='flex justify-center p-5'>
              <Icon name='CircleUserRound' />
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  )
}

export default Footer
