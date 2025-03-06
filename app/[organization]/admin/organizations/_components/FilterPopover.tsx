import { Button } from '@/app/(shared)/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/app/(shared)/components/ui/popover'
import { cn } from '@/app/(shared)/utils'
import { Filter } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import FilterCheckbox from './FilterCheckbox'

function FilterTrigger(props: { isFilterActive?: boolean }) {
  const { isFilterActive = false } = props

  return (
    <PopoverTrigger asChild>
      <Button
        variant='outline'
        className={cn(
          'flex gap-1 lg:min-w-[101px] lg:h-[48px] bg-white text-foreground-800 hover:bg-transparent disabled:text-foreground',
          isFilterActive &&
            'text-brandcolora border-2 lg:gap-0 border-brandcolora/50'
        )}
      >
        <Filter
          className={cn(
            'h-5 w-5 text-foreground-800',
            isFilterActive && 'text-brandcolora -mr-1'
          )}
          strokeWidth={2}
        />
        {isFilterActive && (
          <div className='relative -top-2 -left-[0.3rem] w-[10px] h-[10px] bg-brandcolora rounded-full' />
        )}
        <p className='hidden lg:block text-sm lg:text-base !leading-none'>
          Filter
        </p>
      </Button>
    </PopoverTrigger>
  )
}

function FilterContentFooter(props: {
  onApplyFilters: () => void
  onResetFilters: () => void
}) {
  const { onApplyFilters, onResetFilters } = props

  return (
    <footer className='space-y-2'>
      <Button size='sm' className='w-full' onClick={onApplyFilters}>
        Apply Filter
      </Button>
      <Button
        variant='ghost'
        size='sm'
        className='w-full'
        onClick={onResetFilters}
      >
        Reset
      </Button>
    </footer>
  )
}

function FilterPopover() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [statusFilters, setStatusFilters] = useState({
    ACTIVE: searchParams.getAll('status[]').includes('ACTIVE'),
    INACTIVE: searchParams.getAll('status[]').includes('INACTIVE'),
    SUSPENDED: searchParams.getAll('status[]').includes('SUSPENDED')
  })

  const isFilterActive = searchParams.has('status[]')

  function handleStatusChange(checked: boolean, status: string) {
    setStatusFilters((prev) => ({
      ...prev,
      [status]: checked
    }))
  }

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('status[]') // Remove existing filters

    Object.entries(statusFilters).forEach(([status, checked]) => {
      if (checked) {
        params.append('status[]', status)
      }
    })

    router.replace(`${pathname}?${params}`)
  }

  function resetFilters() {
    setStatusFilters({
      ACTIVE: false,
      INACTIVE: false,
      SUSPENDED: false
    })

    const params = new URLSearchParams(searchParams.toString())
    params.delete('status[]') // Remove existing filters

    router.replace(`${pathname}?${params}`)
  }

  return (
    <Popover>
      <FilterTrigger isFilterActive={isFilterActive} />

      <PopoverContent
        className='max-w-[146px] w-max py-2 pt-4 px-2 space-y-4'
        align='end'
      >
        <div className='px-1'>
          <section className='space-y-4'>
            <header className='text-xs text-muted-foreground uppercase'>
              Status
            </header>

            <div className='space-y-4'>
              <FilterCheckbox
                id='active'
                label='Active'
                checked={statusFilters.ACTIVE}
                onChange={(checked) => handleStatusChange(checked, 'ACTIVE')}
              />
              <FilterCheckbox
                id='inactive'
                label='Inactive'
                checked={statusFilters.INACTIVE}
                onChange={(checked) => handleStatusChange(checked, 'INACTIVE')}
              />
              <FilterCheckbox
                id='suspended'
                label='Suspended'
                checked={statusFilters.SUSPENDED}
                onChange={(checked) => handleStatusChange(checked, 'SUSPENDED')}
              />
            </div>
          </section>
        </div>

        <FilterContentFooter
          onApplyFilters={applyFilters}
          onResetFilters={resetFilters}
        />
      </PopoverContent>
    </Popover>
  )
}

export default FilterPopover
