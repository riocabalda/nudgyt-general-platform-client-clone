'use client'

import { ArrowUpDown } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/app/(shared)/components/ui/popover'
import { Button } from '@/app/(shared)/components/ui/button'
import { cn } from '@/app/(shared)/utils'
import Link from 'next/link'

function FilterPopover() {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const filterUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)

    return `${pathname}?${params.toString()}`
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='flex items-center w-fit px-4 py-3 gap-[10px] lg:h-[48px] bg-white shrink-0 text-foreground'
        >
          <ArrowUpDown className='size-5' />
          <p className='text-sm lg:text-base font-medium !leading-none'>Sort</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='px-0 py-2 text-sm w-max' align='end'>
        <ul>
          <li>
            <Link
              href={filterUrl('filter', 'newest')}
              className={cn(
                'inline-block px-3 py-2 min-w-[160px] hover:bg-neutral-gray-200',
                searchParams.get('filter') === 'newest' &&
                  'bg-neutral-gray-300 hover:bg-neutral-gray-300'
              )}
            >
              Newest first
            </Link>
          </li>
          <li>
            <Link
              href={filterUrl('filter', 'oldest')}
              className={cn(
                'inline-block px-3 py-2 min-w-[160px] hover:bg-neutral-gray-200',
                searchParams.get('filter') === 'oldest' &&
                  'bg-neutral-gray-300 hover:bg-neutral-gray-300'
              )}
            >
              Oldest first
            </Link>
          </li>
          <li>
            <Link
              href={filterUrl('filter', 'alphabetical')}
              className={cn(
                'inline-block px-3 py-2 min-w-[160px] hover:bg-neutral-gray-200',
                searchParams.get('filter') === 'alphabetical' &&
                  'bg-neutral-gray-300 hover:bg-neutral-gray-300'
              )}
            >
              Alphabetical
            </Link>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  )
}

export default FilterPopover
