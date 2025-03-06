import React from 'react'
import { CircleCheck } from 'lucide-react'
import { cn } from '@/app/(shared)/utils'

function CircularProgressBar({
  value,
  className
}: {
  value: number
  className?: string
}) {
  const radius = 18
  const strokeWidth = 2.2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div
      className={cn(
        'relative flex items-center justify-center w-10 h-10',
        className
      )}
    >
      {value === 100 ? (
        <CircleCheck
          strokeWidth={1}
          className='text-success flex flex-grow w-10 h-10'
        />
      ) : (
        <>
          <svg className='w-10 h-10 transform -rotate-90'>
            <circle
              className='text-gray-300'
              strokeWidth={strokeWidth}
              stroke='currentColor'
              fill='transparent'
              r={radius}
              cx='19'
              cy='19'
            />
            <circle
              className='text-brandcolorf/60 '
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap='round'
              stroke='currentColor'
              fill='transparent'
              r={radius}
              cx='19'
              cy='19'
            />
          </svg>
          <div
            className={cn(
              'text-brandcolorf  absolute left-0 top-0 w-full h-full flex items-center translate-y-[1px] -translate-x-[1px] justify-center text-sm font-bold',
              value === 0 && 'text-gray-300'
            )}
          >
            {value}%
          </div>
        </>
      )}
    </div>
  )
}

export default CircularProgressBar
