'use client'

import React, { useEffect, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/app/(shared)/components/ui/popover'
import { ArrowDownUp, ChevronRight, Ellipsis } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import SortContent from './SortContent'

enum Option {
  SORT = 'sort'
}

function SortPopoverMobile() {
  const [openPopover, setOpenPopover] = useState(false)
  const [openSort, setOpenSort] = useState<string | null>(null)

  const searchParams = useSearchParams()

  const isSorted = searchParams.has('sort_by')

  useEffect(() => {
    if (openPopover) setOpenSort(null)
  }, [openPopover])

  const handleSort = (value: string) => {
    setOpenSort(value)
  }
  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <button className='relative py-3 px-2 text-foreground-800'>
          <Ellipsis size={20} strokeWidth={1.5} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className='mt-[7px] w-[calc(100vw-2rem)] mx-4 px-0 py-2 lg:hidden border-none'
        align='end'
      >
        {!openSort && (
          <ul>
            <li>
              <button
                className='w-full flex items-center justify-between p-3 text-foreground-800 hover:bg-muted'
                onClick={() => handleSort(Option.SORT)}
              >
                <div className='flex items-center gap-2'>
                  <div className='relative'>
                    <ArrowDownUp size={20} />
                    {isSorted && (
                      <span className='absolute top-[-2.5px] right-[-2px] bg-brandcolora w-2 h-2 rounded-full' />
                    )}
                  </div>
                  <span>Sort</span>
                </div>
                <ChevronRight size={20} />
              </button>
            </li>
          </ul>
        )}
        {openSort === Option.SORT && <SortContent setOpenSort={setOpenSort} />}
      </PopoverContent>
    </Popover>
  )
}

export default SortPopoverMobile
