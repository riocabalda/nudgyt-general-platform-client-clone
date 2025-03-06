'use client'

import { ArrowDownUp } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/app/(shared)/components/ui/popover'
import { Button } from '@/app/(shared)/components/ui/button'
import { cn } from '@/app/(shared)/utils'
import Link from 'next/link'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useGetServices from '@/app/[organization]/trainer/services/hooks/useGetServices'

function SortPopover() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { orgSlug } = useOrganization()
  const { data: servicesData, isLoading: isLoadingServices } = useGetServices(
    orgSlug,
    String(searchParams)
  )

  const sortUrl = (value: string) => {
    // Renamed function and simplified params
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort_by', value)

    return `${pathname}?${params.toString()}`
  }

  if (servicesData?.total === 0 || isLoadingServices) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='flex items-center w-fit px-4 py-3 gap-[10px] lg:h-[48px] bg-white shrink-0 text-foreground'
        >
          <ArrowDownUp className='size-5' />
          <p className='text-sm lg:text-base font-medium !leading-none'>Sort</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='px-0 py-2 text-sm w-max' align='end'>
        <ul>
          <li>
            <Link
              href={sortUrl('newest')}
              className={cn(
                'inline-block px-3 py-2 min-w-[160px] hover:bg-neutral-gray-200',
                searchParams.get('sort_by') === 'newest' &&
                  'bg-neutral-gray-300 hover:bg-neutral-gray-300'
              )}
            >
              Newest first
            </Link>
          </li>
          <li>
            <Link
              href={sortUrl('oldest')}
              className={cn(
                'inline-block px-3 py-2 min-w-[160px] hover:bg-neutral-gray-200',
                searchParams.get('sort_by') === 'oldest' &&
                  'bg-neutral-gray-300 hover:bg-neutral-gray-300'
              )}
            >
              Oldest first
            </Link>
          </li>
          <li>
            <Link
              href={sortUrl('alphabetical')}
              className={cn(
                'inline-block px-3 py-2 min-w-[160px] hover:bg-neutral-gray-200',
                searchParams.get('sort_by') === 'alphabetical' &&
                  'bg-neutral-gray-300 hover:bg-neutral-gray-300'
              )}
            >
              Alphabetical
            </Link>
          </li>
          <li>
            <Link
              href={sortUrl('most_attempts')}
              className={cn(
                'inline-block px-3 py-2 min-w-[160px] hover:bg-neutral-gray-200',
                searchParams.get('sort_by') === 'most_attempts' &&
                  'bg-neutral-gray-300 hover:bg-neutral-gray-300'
              )}
            >
              Most attempts
            </Link>
          </li>
          <li>
            <Link
              href={sortUrl('least_attempts')}
              className={cn(
                'inline-block px-3 py-2 min-w-[160px] hover:bg-neutral-gray-200',
                searchParams.get('sort_by') === 'least_attempts' &&
                  'bg-neutral-gray-300 hover:bg-neutral-gray-300'
              )}
            >
              Least attempts
            </Link>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  )
}

export default SortPopover
