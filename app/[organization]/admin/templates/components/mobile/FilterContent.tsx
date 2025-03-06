import React, { Dispatch, SetStateAction } from 'react'
import { cn } from '@/app/(shared)/utils'
import { usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, Filter } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/app/(shared)/components/ui/button'

function FilterContent({
  setOpenFilter
}: {
  setOpenFilter: Dispatch<SetStateAction<string | null>>
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const handleCloseFilter = () => {
    setOpenFilter(null)
  }

  const filterUrl = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('filter', value)
    return `${pathname}?${params.toString()}`
  }

  return (
    <ul>
      <li>
        <Button
          variant='ghost'
          onClick={handleCloseFilter}
          className={cn(
            'flex gap-2 w-full h-[55px] justify-start px-3 py-2 font-normal hover:bg-neutral-gray-200'
          )}
        >
          <ChevronLeft size={20} />
          <Filter size={20} />
          <span>Filter</span>
        </Button>
      </li>
      <li>
        <Link
          href={filterUrl('newest')}
          className={cn(
            'flex w-full h-[55px] items-center justify-start px-3 py-2 font-normal hover:bg-neutral-gray-200',
            searchParams.get('filter') === 'newest' &&
              'bg-neutral-gray-300 hover:bg-neutral-gray-300 font-semibold'
          )}
        >
          Newest first
        </Link>
      </li>
      <li>
        <Link
          href={filterUrl('oldest')}
          className={cn(
            'flex w-full h-[55px] items-center justify-start px-3 py-2 font-normal hover:bg-neutral-gray-200',
            searchParams.get('filter') === 'oldest' &&
              'bg-neutral-gray-300 hover:bg-neutral-gray-300 font-semibold'
          )}
        >
          Oldest first
        </Link>
      </li>
      <li>
        <Link
          href={filterUrl('alphabetical')}
          className={cn(
            'flex w-full h-[55px] items-center justify-start px-3 py-2 font-normal hover:bg-neutral-gray-200',
            searchParams.get('filter') === 'alphabetical' &&
              'bg-neutral-gray-300 hover:bg-neutral-gray-300 font-semibold'
          )}
        >
          Alphabetical
        </Link>
      </li>
    </ul>
  )
}

export default FilterContent
