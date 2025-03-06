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
import { SORT_BY, REQUIRED_FILTERS } from '../constants'
import Link from 'next/link'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { useGetServices } from '../hooks/useGetServices'

function SortPopover() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const isNewServices = searchParams.get('service_view') === 'new' || false

  const { orgSlug } = useOrganization()
  const { data: servicesData, isLoading: isLoadingServices } = useGetServices(
    orgSlug,
    String(searchParams)
  )

  const sortUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)

    return `${pathname}?${params.toString()}`
  }

  if (servicesData?.total === 0 || isLoadingServices) return null

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='icon'
          className='flex items-center h-full w-fit px-0 lg:px-4 py-3 hover:bg-transparent lg:hover:bg-accent gap-[10px] lg:h-[48px] border-none lg:border-solid lg:bg-white shrink-0 text-foreground'
        >
          <ArrowDownUp className='size-5' />
          <p className='text-sm lg:text-base font-medium !leading-none'>Sort</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='px-0 py-2 text-sm w-max' align='end'>
        <ul>
          <li>
            <Link
              href={sortUrl(REQUIRED_FILTERS.SORT_BY, SORT_BY.NEWEST)}
              className={cn(
                'inline-block px-3 py-2 min-w-[160px] hover:bg-neutral-gray-200',
                searchParams.get(REQUIRED_FILTERS.SORT_BY) === SORT_BY.NEWEST &&
                  'bg-neutral-gray-300 hover:bg-neutral-gray-300'
              )}
            >
              Newest first
            </Link>
          </li>
          <li>
            <Link
              href={sortUrl(REQUIRED_FILTERS.SORT_BY, SORT_BY.OLDEST)}
              className={cn(
                'inline-block px-3 py-2 min-w-[160px] hover:bg-neutral-gray-200',
                searchParams.get(REQUIRED_FILTERS.SORT_BY) === SORT_BY.OLDEST &&
                  'bg-neutral-gray-300 hover:bg-neutral-gray-300'
              )}
            >
              Oldest first
            </Link>
          </li>
          <li>
            <Link
              href={sortUrl(REQUIRED_FILTERS.SORT_BY, SORT_BY.ALPHABETICAL)}
              className={cn(
                'inline-block px-3 py-2 min-w-[160px] hover:bg-neutral-gray-200',
                searchParams.get(REQUIRED_FILTERS.SORT_BY) ===
                  SORT_BY.ALPHABETICAL &&
                  'bg-neutral-gray-300 hover:bg-neutral-gray-300'
              )}
            >
              Alphabetical
            </Link>
          </li>
          {!isNewServices && (
            <>
              <li>
                <Link
                  href={sortUrl(
                    REQUIRED_FILTERS.SORT_BY,
                    SORT_BY.MOST_ATTEMPTS
                  )}
                  className={cn(
                    'inline-block px-3 py-2 min-w-[160px] hover:bg-neutral-gray-200',
                    searchParams.get(REQUIRED_FILTERS.SORT_BY) ===
                      SORT_BY.MOST_ATTEMPTS &&
                      'bg-neutral-gray-300 hover:bg-neutral-gray-300'
                  )}
                >
                  Most attempts
                </Link>
              </li>
              <li>
                <Link
                  href={sortUrl(
                    REQUIRED_FILTERS.SORT_BY,
                    SORT_BY.LEAST_ATTEMPTS
                  )}
                  className={cn(
                    'inline-block px-3 py-2 min-w-[160px] hover:bg-neutral-gray-200',
                    searchParams.get(REQUIRED_FILTERS.SORT_BY) ===
                      SORT_BY.LEAST_ATTEMPTS &&
                      'bg-neutral-gray-300 hover:bg-neutral-gray-300'
                  )}
                >
                  Least attempts
                </Link>
              </li>
              <li>
                <Link
                  href={sortUrl(
                    REQUIRED_FILTERS.SORT_BY,
                    SORT_BY.SAVED_SIMULATION
                  )}
                  className={cn(
                    'inline-block px-3 py-2 min-w-[160px] hover:bg-neutral-gray-200',
                    searchParams.get(REQUIRED_FILTERS.SORT_BY) ===
                      SORT_BY.SAVED_SIMULATION &&
                      'bg-neutral-gray-300 hover:bg-neutral-gray-300'
                  )}
                >
                  Saved simulation
                </Link>
              </li>
            </>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  )
}

export default SortPopover
