'use client'

import React, { useEffect, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/app/(shared)/components/ui/popover'
import { ChevronRight, Ellipsis, Filter } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import FilterContent from './FilterContent'

enum Option {
  FILTER = 'filter',
  SORT = 'sort'
}

function FilterPopoverMobile() {
  const [openPopover, setOpenPopover] = useState(false)
  const [openFilter, setOpenFilter] = useState<string | null>(null)

  const searchParams = useSearchParams()

  const isFiltered = searchParams.has('filter')

  useEffect(() => {
    if (openPopover) setOpenFilter(null)
  }, [openPopover])

  const handleFilter = (value: string) => {
    setOpenFilter(value)
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
        {!openFilter && (
          <ul>
            <li>
              <button
                className='w-full flex items-center justify-between p-3 text-foreground-800 hover:bg-muted'
                onClick={() => handleFilter(Option.FILTER)}
              >
                <div className='flex items-center gap-2'>
                  <div className='relative'>
                    <Filter size={20} />
                    {isFiltered && (
                      <span className='absolute top-[-2.5px] right-[-2px] bg-brandcolora w-2 h-2 rounded-full' />
                    )}
                  </div>
                  <span>Filter</span>
                </div>
                <ChevronRight size={20} />
              </button>
            </li>
          </ul>
        )}
        {openFilter === Option.FILTER && (
          <FilterContent setOpenFilter={setOpenFilter} />
        )}
      </PopoverContent>
    </Popover>
  )
}

export default FilterPopoverMobile
