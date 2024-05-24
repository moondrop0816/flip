import Link from 'next/link'
import Icon from '../icon'

const Footer = ({ isAddible = false }) => {
  return (
    <footer className='bg-slate-300 fixed w-screen bottom-0'>
      {isAddible ? (
        <Link
          href={'/addpost'}
          scroll={false}
          className='flex justify-center p-5 bg-slate-600 rounded-full absolute bottom-[130%] right-5'
        >
          <Icon name='Pencil' color='#fff' />
        </Link>
      ) : null}
      <nav>
        <ul className='flex flex-wrap items-center'>
          <li className='basis-1/4 '>
            <Link
              href={'/feed'}
              scroll={false}
              className='flex justify-center p-5'
            >
              <Icon name='Home' />
            </Link>
          </li>
          <li className='basis-1/4 '>
            <Link
              href={'/followingfeed'}
              scroll={false}
              className='flex justify-center p-5'
            >
              <Icon name='Users' />
            </Link>
          </li>
          <li className='basis-1/4 '>
            <Link
              href={'/search'}
              scroll={false}
              className='flex justify-center p-5'
            >
              <Icon name='Search' />
            </Link>
          </li>
          <li className='basis-1/4 '>
            <Link href={'/'} scroll={false} className='flex justify-center p-5'>
              <Icon name='Mail' />
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  )
}

export default Footer
