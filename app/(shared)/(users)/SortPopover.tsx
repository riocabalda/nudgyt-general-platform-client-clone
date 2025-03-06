'use client'

import { ArrowUpDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from '../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '../components/ui/dropdown-menu'
import useUser from '../hooks/useUser'

function SortPopover({ disabled }: { disabled?: boolean }) {
  const { user } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const getSortBy = searchParams.get('sortBy')
  const [sortBy, setSortBy] = useState(getSortBy || 'created_at')

  const isSuperAdmin = user?.is_super_admin ?? false

  const handleSortChange = (value: string) => {
    setSortBy(value)

    const params = new URLSearchParams(searchParams.toString())
    params.set('sortBy', value)
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
        <DropdownMenuRadioGroup value={sortBy} onValueChange={handleSortChange}>
          {/* <DropdownMenuRadioItem
            value='status'
            className='focus:bg-neutral-gray-300 rounded-none cursor-pointer'
          >
            Status
          </DropdownMenuRadioItem> */}
          {/* <DropdownMenuRadioItem
            value={isSuperAdmin ? 'name' : 'full_name'}
            className='focus:bg-neutral-gray-300 rounded-none cursor-pointer'
          >
            Alphabetically
          </DropdownMenuRadioItem> */}
          <DropdownMenuRadioItem
            value='created_at'
            className='focus:bg-neutral-gray-300 rounded-none cursor-pointer'
          >
            Date Joined
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            value={isSuperAdmin ? 'members' : 'services'}
            className='focus:bg-neutral-gray-300 rounded-none cursor-pointer'
            // disabled={!isSuperAdmin}
            disabled={true}
          >
            Number of Services
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SortPopover
