import React from 'react'
import { Skeleton } from './ui/skeleton'

function MainSkeleton() {
  return (
    <>
      <div className='h-svh hidden lg:flex'>
        <aside className='w-[300px] bg-white p-[24px] flex flex-col'>
          <div className='grow'>
            <Skeleton className='h-[60px] rounded-md' />
            <div className='flex mt-[40px] gap-[8px]'>
              <Skeleton className='size-[40px] rounded-full shrink-0' />
              <div className='flex flex-col gap-[8px] w-full justify-center'>
                <Skeleton className='h-[14px] w-[80%] rounded-md' />
                <Skeleton className='h-[10px] w-[40%] rounded-md' />
              </div>
            </div>
            <div className='mt-[40px]'>
              <Skeleton className='h-[16px] w-[60%]' />
              <div className='mt-4'>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className='flex items-center gap-[10px] px-4 py-2'
                  >
                    <Skeleton className='size-[30px]' />
                    <Skeleton className='h-[16px] w-[80%]' />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='mt-[40px]'>
            <Skeleton className='h-[16px] w-[60%]' />
            <div className='mt-4'>
              {[...Array(2)].map((_, i) => (
                <div key={i} className='flex items-center gap-[10px] px-4 py-2'>
                  <Skeleton className='size-[30px]' />
                  <Skeleton className='h-[16px] w-[80%]' />
                </div>
              ))}
            </div>
          </div>
        </aside>
        <main className='flex-1 bg-neutral-gray-200'></main>
      </div>
      <div className='lg:hidden'>
        <header className='bg-white h-[60px] flex items-center justify-between px-[16px]'>
          <Skeleton className='h-[20px] w-[30%]' />
          <div className='flex flex-col gap-[4px] w-[30px]'>
            <Skeleton className='h-[4px] w-full' />
            <Skeleton className='h-[4px] w-full' />
            <Skeleton className='h-[4px] w-full' />
          </div>
        </header>
      </div>
    </>
  )
}

export default MainSkeleton
