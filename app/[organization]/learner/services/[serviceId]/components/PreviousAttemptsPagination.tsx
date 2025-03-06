'use client'

import { WithPagination } from '@/app/(shared)/types'
import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { addCommas } from '@/app/(shared)/utils'
import { Button } from '@/app/(shared)/components/ui/button'

type TPreviousAttemptsPaginationProps = {
  data:
    | WithPagination<
        | {
            simulation_id: string
            started_at: Date
            score: number
            competency: string
          }[]
        | undefined
      >
    | undefined
  setPage: React.Dispatch<React.SetStateAction<string>>
}

function PreviousAttemptsPagination({
  data,
  setPage
}: TPreviousAttemptsPaginationProps) {
  const handleClickPrev = () =>
    setPage(String(Number(data?.current_page || 0) - 1))
  const handleClickNext = () =>
    setPage(String(Number(data?.current_page || 0) + 1))

  return (
    <div className='absolute bottom-3 right-[20px] lg:static lg:block'>
      <div className='flex items-center gap-6'>
        <p>
          {addCommas(data?.from || 0)} - {addCommas(data?.to || 0)} of{' '}
          {addCommas(data?.total || 0)}
        </p>
        <div className='flex gap-6'>
          <Button
            size='icon'
            variant='outline'
            className='w-6 h-6 bg-transparent border-none disabled:bg-transparent disabled:text-muted-foreground text-foreground'
            disabled={!data?.prev_page}
            onClick={handleClickPrev}
          >
            <ChevronLeft className='w-6 h-6' />
          </Button>
          <Button
            size='icon'
            variant='outline'
            className='w-6 h-6 bg-transparent border-none disabled:bg-transparent disabled:text-muted-foreground text-foreground'
            disabled={!data?.next_page}
            onClick={handleClickNext}
          >
            <ChevronRight className='w-6 h-6' />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PreviousAttemptsPagination
