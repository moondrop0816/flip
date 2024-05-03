import { FadeLoader } from 'react-spinners'

export default function Loading() {
  return (
    <div className='w-screen h-screen bg-slate-500 fixed top-0 left-0 z-50'>
      <div className='absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4'>
        <FadeLoader color='#fff' />
      </div>
    </div>
  )
}
