'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import { Checkbox } from '@/app/(shared)/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/app/(shared)/components/ui/popover'
import { Filter } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

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
      <Checkbox id={id} onCheckedChange={onChange} checked={checked} />
      <label
        htmlFor={id}
        className='text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
      >
        {label}
      </label>
    </div>
  )
}

interface FilterGroup {
  title: string
  filters: {
    id: string
    label: string
    value: string
  }[]
}

interface FilterPopoverProps {
  filterGroups: FilterGroup[]
  paramKeys: Record<string, string> // maps filter group titles to their URL param keys
  onFiltersApply?: (params: URLSearchParams) => void
}

function FilterPopover({
  filterGroups,
  paramKeys,
  onFiltersApply
}: FilterPopoverProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Create dynamic filter state based on filterGroups
  const [filterStates, setFilterStates] = useState(() => {
    const states: Record<string, Record<string, boolean>> = {}

    filterGroups.forEach((group) => {
      states[group.title] = {}
      group.filters.forEach((filter) => {
        states[group.title][filter.value] = searchParams
          .getAll(`${paramKeys[group.title]}[]`)
          .includes(filter.value)
      })
    })

    return states
  })

  const isFiltered = filterGroups.some((group) =>
    searchParams.has(`${paramKeys[group.title]}[]`)
  )

  const handleFilterChange = (
    groupTitle: string,
    value: string,
    checked: boolean
  ) => {
    setFilterStates((prev) => ({
      ...prev,
      [groupTitle]: {
        ...prev[groupTitle],
        [value]: checked
      }
    }))
  }

  const handleApplyFilters = () => {
    const params = new URLSearchParams()

    Object.entries(filterStates).forEach(([groupTitle, groupFilters]) => {
      Object.entries(groupFilters).forEach(([value, checked]) => {
        if (checked) {
          params.append(`${paramKeys[groupTitle]}[]`, value)
        }
      })
    })

    if (onFiltersApply) {
      onFiltersApply(params)
    } else {
      router.push(`${pathname}?${params.toString()}`)
    }
  }

  const handleResetFilters = () => {
    const resetStates: Record<string, Record<string, boolean>> = {}

    filterGroups.forEach((group) => {
      resetStates[group.title] = {}
      group.filters.forEach((filter) => {
        resetStates[group.title][filter.value] = false
      })
    })

    setFilterStates(resetStates)
    router.push(pathname)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={twMerge(
            'flex gap-1 lg:min-w-[101px] lg:h-[48px] bg-white text-foreground-800 hover:bg-transparent',
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
      <PopoverContent className='max-w-[146px] w-max py-2 px-2' align='start'>
        <div className='flex flex-col px-1'>
          {filterGroups.map((group) => (
            <div key={group.title}>
              <p className='text-xs text-muted-foreground py-2'>
                {group.title}
              </p>
              <div className='flex flex-col gap-[16px] py-2'>
                {group.filters.map((filter) => (
                  <FilterCheckbox
                    key={filter.id}
                    label={filter.label}
                    onChange={(checked) =>
                      handleFilterChange(group.title, filter.value, checked)
                    }
                    id={filter.id}
                    checked={filterStates[group.title][filter.value]}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className='mt-3'>
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
