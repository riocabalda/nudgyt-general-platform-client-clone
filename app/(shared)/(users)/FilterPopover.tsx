'use client'

import { Filter } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from '../components/ui/button'
import { Checkbox } from '../components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../components/ui/popover'
import useUser from '../hooks/useUser'
import { isPathIncluded } from '../utils'

export function FilterCheckbox({
  label,
  onChange,
  id,
  checked,
  disabled
}: {
  label: string
  onChange: (checked: boolean) => void
  id: string
  checked: boolean
  disabled?: boolean
}) {
  return (
    <div className='flex items-center space-x-2 '>
      <Checkbox
        id={id}
        onCheckedChange={onChange}
        checked={checked}
        disabled={disabled}
      />
      <label
        htmlFor={id}
        className='text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
      >
        {label}
      </label>
    </div>
  )
}

function FilterPopover({ disabled }: { disabled?: boolean }) {
  const { user } = useUser()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isIncluded = isPathIncluded(pathname, '/admin/users/organizations')

  const [statusFilters, setStatusFilters] = useState({
    APPROVED: searchParams.getAll('status[]').includes('APPROVED'),
    VERIFIED: searchParams.getAll('status[]').includes('VERIFIED'),
    UNVERIFIED: searchParams.getAll('status[]').includes('UNVERIFIED'),
    BLOCKED: searchParams.getAll('status[]').includes('BLOCKED'),
    ARCHIVED: searchParams.getAll('status[]').includes('ARCHIVED')
  })

  const [roleFilters, setUserTypeFilters] = useState({
    Admin: searchParams.getAll('role[]').includes('Admin'),
    Trainer: searchParams.getAll('role[]').includes('Trainer'),
    Learner: searchParams.getAll('role[]').includes('Learner')
  })

  const isSuperAdmin = user?.is_super_admin ?? false
  const isFiltered = searchParams.has('status[]') || searchParams.has('role[]')

  const handleStatusChange = (checked: boolean, status: string) => {
    setStatusFilters((prev) => ({
      ...prev,
      [status]: checked
    }))
  }

  const handleUserTypeChange = (checked: boolean, role: string) => {
    setUserTypeFilters((prev) => ({
      ...prev,
      [role]: checked
    }))
  }

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('status[]')
    params.delete('role[]')

    Object.entries(statusFilters).forEach(([status, checked]) => {
      if (checked) {
        params.append('status[]', status)
      }
    })

    Object.entries(roleFilters).forEach(([role, checked]) => {
      if (checked) {
        params.append('role[]', role)
      }
    })

    router.replace(`${pathname}?${params}`)
  }

  const handleResetFilters = () => {
    setStatusFilters({
      APPROVED: false,
      VERIFIED: false,
      UNVERIFIED: false,
      BLOCKED: false,
      ARCHIVED: false
    })
    setUserTypeFilters({
      Admin: false,
      Trainer: false,
      Learner: false
    })

    const params = new URLSearchParams(searchParams.toString())
    params.delete('status[]')
    params.delete('role[]')

    router.replace(`${pathname}?${params}`)
  }

  return (
    <Popover>
      <PopoverTrigger disabled={disabled} asChild>
        <Button
          variant='outline'
          className={twMerge(
            'flex gap-1 lg:min-w-[101px] lg:h-[48px] bg-white text-foreground-800 hover:bg-transparent disabled:text-foreground',
            isFiltered &&
              'text-brandcolora border-2 lg:gap-0 border-brandcolora/50'
          )}
        >
          <Filter
            className={twMerge(
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
            <p className='text-xs text-muted-foreground py-2'>VERIFICATION</p>
            <div className='flex flex-col gap-[16px] py-2'>
              <FilterCheckbox
                label='Approved'
                onChange={(checked) => handleStatusChange(checked, 'APPROVED')}
                id='approved'
                checked={statusFilters.APPROVED}
              />
              <FilterCheckbox
                label='Verified'
                onChange={(checked) => handleStatusChange(checked, 'VERIFIED')}
                id='verified'
                checked={statusFilters.VERIFIED}
              />
              <FilterCheckbox
                label='Unverified'
                onChange={(checked) =>
                  handleStatusChange(checked, 'UNVERIFIED')
                }
                id='unverified'
                checked={statusFilters.UNVERIFIED}
              />
              <FilterCheckbox
                label='Blocked'
                onChange={(checked) => handleStatusChange(checked, 'BLOCKED')}
                id='blocked'
                checked={statusFilters.BLOCKED}
              />
              <FilterCheckbox
                label='Archived'
                onChange={(checked) => handleStatusChange(checked, 'ARCHIVED')}
                id='archived'
                checked={statusFilters.ARCHIVED}
              />
            </div>
          </div>
          {(!isSuperAdmin || (isSuperAdmin && isIncluded)) && (
            <div>
              <p className='text-xs text-muted-foreground py-2'>USER TYPE</p>
              <div className='flex flex-col gap-[16px] py-2 text-xs lg:text-sm'>
                <FilterCheckbox
                  label='Admin'
                  onChange={(checked) => handleUserTypeChange(checked, 'Admin')}
                  id='admin'
                  checked={roleFilters.Admin}
                />
                <FilterCheckbox
                  label='Trainer'
                  onChange={(checked) =>
                    handleUserTypeChange(checked, 'Trainer')
                  }
                  id='trainer'
                  checked={roleFilters.Trainer}
                />
                <FilterCheckbox
                  label='Learner'
                  onChange={(checked) =>
                    handleUserTypeChange(checked, 'Learner')
                  }
                  id='learner'
                  checked={roleFilters.Learner}
                />
              </div>
            </div>
          )}
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
