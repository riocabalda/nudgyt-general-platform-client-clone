'use client'

import React from 'react'
import { Button } from './ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { addCommas } from '../utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

function Pagination({
  from,
  to,
  total,
  prev,
  next,
  currentPage
}: {
  from?: number
  to?: number
  total?: number
  prev?: string
  next?: string
  currentPage: number
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const handleClickPrev = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(Number(currentPage) - 1))
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleClickNext = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(Number(currentPage) + 1))
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className='flex items-center gap-6'>
      <p className='text-nowrap'>
        {addCommas(from || 0)} - {addCommas(to || 0)} of {addCommas(total || 0)}
      </p>
      <div className='flex gap-6'>
        <Button
          size='icon'
          variant='outline'
          className='w-6 h-6 bg-transparent border-none disabled:bg-transparent disabled:text-muted-foreground text-foreground'
          disabled={!prev}
          onClick={handleClickPrev}
        >
          <ChevronLeft className='w-6 h-6' />
        </Button>
        <Button
          size='icon'
          variant='outline'
          className='w-6 h-6 bg-transparent border-none disabled:bg-transparent disabled:text-muted-foreground text-foreground'
          disabled={!next}
          onClick={handleClickNext}
        >
          <ChevronRight className='w-6 h-6' />
        </Button>
      </div>
    </div>
  )
}

export default Pagination
