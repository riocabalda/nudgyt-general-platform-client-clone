import { Skeleton } from '@/app/(shared)/components/ui/skeleton'
import React from 'react'

function TimerSkeleton() {
  return (
    <div className='flex h-[38px] items-center bg-white border-[1px] border-neutral-gray-300 rounded-md px-[6px] z-10'>
      <Skeleton className='w-8 h-6 rounded-md bg-neutral-gray-300' />
      <div className='h-6 w-0.5 mx-1 my-auto self-stretch bg-neutral-gray-300'></div>
      <Skeleton className='w-[75px] h-6 rounded-md bg-neutral-gray-300 animate-pulse' />
    </div>
  )
}

export default TimerSkeleton
