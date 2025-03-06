import { Loader } from 'lucide-react'

export function LoadingSpinner() {
  return (
    <div className='grid place-items-center p-4'>
      <Loader className='w-4 h-4 mr-2 animate-spin' />
    </div>
  )
}

type LoadingMoreIndicatorProps = {
  type?: 'organizations' | 'users'
}

export function LoadingMoreIndicator({
  type = 'users'
}: LoadingMoreIndicatorProps) {
  return (
    <li className='flex items-center justify-center gap-2'>
      <Loader className='w-4 h-4 mr-2 animate-spin' />
      <span>Loading more {type}...</span>
    </li>
  )
}
