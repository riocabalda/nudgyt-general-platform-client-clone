'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/app/(shared)/components/ui/dropdown-menu'
import { TierEnum } from '@/app/(shared)/types'
import { ArrowUpDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

const SORT_PARAM_KEY = 'sortBy'
const SortBy = {
  ALPHABETICALLY: 'name',
  STATUS: 'status',
  JOINED: 'created_at',
  RATE: 'rate',
  SEATS: 'seats',
  SERVICES: 'services'
} as const

function SortPopover(props: { disabled?: boolean; tier?: TierEnum }) {
  const { disabled } = props
  const { tier } = props

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sortBy = searchParams.get(SORT_PARAM_KEY) ?? SortBy.JOINED

  function reflectSortInParams(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set(SORT_PARAM_KEY, value)

    router.replace(`${pathname}?${params}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        className='outline-none flex items-center gap-[10px] ml-auto'
        asChild
      >
        <Button
          variant='outline'
          className='!px-8 bg-white flex items-center justify-center gap-[10px] disabled:text-foreground'
        >
          <ArrowUpDown
            className={twMerge('h-5 w-5 text-foreground-800')}
            strokeWidth={2}
          />
          <p className='hidden lg:block text-sm lg:text-base !leading-none'>
            Sort
          </p>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuRadioGroup
          value={sortBy}
          onValueChange={reflectSortInParams}
        >
          {/* <DropdownMenuRadioItem
            value={SortBy.STATUS}
            className='focus:bg-neutral-gray-300 rounded-none cursor-pointer'
          >
            Status
          </DropdownMenuRadioItem> */}
          {/* <DropdownMenuRadioItem
            value={SortBy.ALPHABETICALLY}
            className='focus:bg-neutral-gray-300 rounded-none cursor-pointer'
          >
            Alphabetically
          </DropdownMenuRadioItem> */}
          <DropdownMenuRadioItem
            value={SortBy.JOINED}
            className='focus:bg-neutral-gray-300 rounded-none cursor-pointer'
          >
            Date Joined
          </DropdownMenuRadioItem>
          {tier === TierEnum.ENTERPRISE && (
            <DropdownMenuRadioItem
              value={SortBy.RATE}
              className='focus:bg-neutral-gray-300 rounded-none cursor-pointer'
            >
              Rate
            </DropdownMenuRadioItem>
          )}
          {tier === TierEnum.ENTERPRISE && (
            <DropdownMenuRadioItem
              value={SortBy.SEATS}
              className='focus:bg-neutral-gray-300 rounded-none cursor-pointer'
            >
              Seats
            </DropdownMenuRadioItem>
          )}
          <DropdownMenuRadioItem
            value={SortBy.SERVICES}
            className='focus:bg-neutral-gray-300 rounded-none cursor-pointer'
            disabled
          >
            Number of Services
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SortPopover
