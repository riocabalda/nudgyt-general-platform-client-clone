import React, { Dispatch, SetStateAction } from 'react'
import { cn } from '@/app/(shared)/utils'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SortContent({
  setOpenSortFilter
}: {
  setOpenSortFilter: Dispatch<SetStateAction<string | null>>
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const handleCloseSort = () => {
    setOpenSortFilter(null)
  }
  const sortUrl = (sortBy: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (sortBy === 'newest') {
      params.delete('sort_by')
    } else {
      params.set('sort_by', sortBy)
    }

    return `${pathname}?${params.toString()}`
  }

  return (
    <ul>
      <li>
        <Link
          href={sortUrl('newest')}
          onClick={handleCloseSort}
          className={cn(
            'inline-block px-3 py-2 w-full hover:bg-muted text-foreground-800',
            (!searchParams.has('sort_by') ||
              searchParams.get('sort_by') === 'newest') &&
              'bg-muted font-semibold'
          )}
        >
          Newest first
        </Link>
      </li>
      <li>
        <Link
          href={sortUrl('oldest')}
          onClick={handleCloseSort}
          className={cn(
            'inline-block px-3 py-2 w-full hover:bg-muted text-foreground-800',
            searchParams.get('sort_by') === 'oldest' && 'bg-muted font-semibold'
          )}
        >
          Oldest first
        </Link>
      </li>
      <li>
        <Link
          href={sortUrl('alphabetical')}
          onClick={handleCloseSort}
          className={cn(
            'inline-block px-3 py-2 w-full hover:bg-muted text-foreground-800',
            searchParams.get('sort_by') === 'alphabetical' &&
              'bg-muted font-semibold'
          )}
        >
          Alphabetical
        </Link>
      </li>
    </ul>
  )
}

export default SortContent
