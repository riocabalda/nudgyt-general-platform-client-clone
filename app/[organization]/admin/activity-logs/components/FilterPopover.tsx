'use client'

import { Filter } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/app/(shared)/components/ui/popover'
import { Button } from '@/app/(shared)/components/ui/button'
import { Checkbox } from '@/app/(shared)/components/ui/checkbox'
import { useState } from 'react'
import { cn } from '@/app/(shared)/utils'

export function FilterCheckbox({
  label,
  onChange,
  id,
  checked
}: {
  label: string
  onChange: (checked: boolean) => void
  id: string
  checked: boolean
}) {
  return (
    <div className='flex items-center space-x-2 '>
      <Checkbox
        className='h-6 w-6 lg:h-4 lg:w-4'
        id={id}
        onCheckedChange={onChange}
        checked={checked}
      />
      <label
        htmlFor={id}
        className='text-base lg:text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
      >
        {label}
      </label>
    </div>
  )
}

function FilterPopover() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [serviceFilters, setServiceFilters] = useState({
    DELETED: searchParams.getAll('service[]').includes('DELETED'),
    EDITED: searchParams.getAll('service[]').includes('EDITED'),
    PUBLISHED: searchParams.getAll('service[]').includes('PUBLISHED')
  })

  const [userStatusFilters, setUserStatusFilters] = useState({
    INVITED: searchParams.getAll('user_status[]').includes('INVITED'),
    APPROVED: searchParams.getAll('user_status[]').includes('APPROVED'),
    BLOCKED: searchParams.getAll('user_status[]').includes('BLOCKED'),
    UNBLOCKED: searchParams.getAll('user_status[]').includes('UNBLOCKED'),
    ARCHIVED: searchParams.getAll('user_status[]').includes('ARCHIVED')
  })

  const isFiltered =
    searchParams.has('service[]') || searchParams.has('user_status[]')

  const handleServiceChange = (checked: boolean, serviceFilter: string) => {
    setServiceFilters((prev) => ({
      ...prev,
      [serviceFilter]: checked
    }))
  }

  const handleUserStatusChange = (checked: boolean, userStatus: string) => {
    setUserStatusFilters((prev) => ({
      ...prev,
      [userStatus]: checked
    }))
  }

  const handleApplyFilters = () => {
    const params = new URLSearchParams()
    const search = searchParams.get('search')

    if (search) params.append('search', search)

    Object.entries(serviceFilters).forEach(([status, checked]) => {
      if (checked) {
        params.append('service[]', status)
      }
    })

    Object.entries(userStatusFilters).forEach(([status, checked]) => {
      if (checked) {
        params.append('user_status[]', status)
      }
    })

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleResetFilters = () => {
    const params = new URLSearchParams()
    const search = searchParams.get('search')

    if (search) params.append('search', search)

    setServiceFilters({
      DELETED: false,
      EDITED: false,
      PUBLISHED: false
    })
    setUserStatusFilters({
      INVITED: false,
      APPROVED: false,
      BLOCKED: false,
      UNBLOCKED: false,
      ARCHIVED: false
    })

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'flex gap-1 lg:min-w-[101px] lg:h-[48px] bg-white text-foreground-800 hover:bg-transparent',
            isFiltered &&
              'text-brandcolora border-2 lg:gap-0 border-brandcolora/50'
          )}
        >
          <Filter
            className={cn(
              'h-5 w-5 text-foreground-800',
              isFiltered && 'text-brandcolora -mr-1'
            )}
            strokeWidth={2}
          />
          {isFiltered && (
            <div className='relative -top-2 -left-[0.3rem] w-[10px] h-[10px] bg-brandcolora rounded-full' />
          )}
          <p className='hidden lg:block text-sm lg:text-base !leading-none'>
            Filter
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='max-w-[146px] w-max py-2 px-2' align='end'>
        <div className='flex flex-col px-1'>
          <div>
            <p className='text-xs text-muted-foreground py-2'>SERVICE</p>
            <div className='flex flex-col gap-[16px] py-2'>
              <FilterCheckbox
                label='Deleted'
                onChange={(checked) => handleServiceChange(checked, 'DELETED')}
                id='deleted'
                checked={serviceFilters.DELETED}
              />
              <FilterCheckbox
                label='Edited'
                onChange={(checked) => handleServiceChange(checked, 'EDITED')}
                id='edited'
                checked={serviceFilters.EDITED}
              />
              <FilterCheckbox
                label='Published'
                onChange={(checked) =>
                  handleServiceChange(checked, 'PUBLISHED')
                }
                id='published'
                checked={serviceFilters.PUBLISHED}
              />
            </div>
          </div>
          <div>
            <p className='text-xs text-muted-foreground py-2'>User</p>
            <div className='flex flex-col gap-[16px] py-2 text-xs lg:text-sm'>
              <FilterCheckbox
                label='Invited'
                onChange={(checked) =>
                  handleUserStatusChange(checked, 'INVITED')
                }
                id='invited'
                checked={userStatusFilters.INVITED}
              />
              <FilterCheckbox
                label='Approved'
                onChange={(checked) =>
                  handleUserStatusChange(checked, 'APPROVED')
                }
                id='approved'
                checked={userStatusFilters.APPROVED}
              />
              <FilterCheckbox
                label='Blocked'
                onChange={(checked) =>
                  handleUserStatusChange(checked, 'BLOCKED')
                }
                id='blocked'
                checked={userStatusFilters.BLOCKED}
              />
              <FilterCheckbox
                label='Unblocked'
                onChange={(checked) =>
                  handleUserStatusChange(checked, 'UNBLOCKED')
                }
                id='unblocked'
                checked={userStatusFilters.UNBLOCKED}
              />
              <FilterCheckbox
                label='Archived'
                onChange={(checked) =>
                  handleUserStatusChange(checked, 'ARCHIVED')
                }
                id='unblocked'
                checked={userStatusFilters.ARCHIVED}
              />
            </div>
          </div>
        </div>
        <div>
          <Button
            className='text-xs lg:text-sm w-full h-fit py-2 mt-2'
            onClick={handleApplyFilters}
          >
            Apply Filter
          </Button>
          <Button
            className='text-xs lg:text-sm w-full h-fit py-2 mt-2 bg-white text-brandcolora hover:bg-brandcolora/10'
            onClick={handleResetFilters}
          >
            Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default FilterPopover
