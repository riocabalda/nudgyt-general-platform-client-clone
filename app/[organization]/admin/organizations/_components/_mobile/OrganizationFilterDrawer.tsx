import { FilterCheckbox } from '@/app/(shared)/(users)/FilterPopover'
import { Button } from '@/app/(shared)/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger
} from '@/app/(shared)/components/ui/drawer'
import { cn } from '@/app/(shared)/utils'
import { ChevronRight, Filter } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

function OrganizationFilterDrawer({
  setOpen
}: {
  setOpen: (open: boolean) => void
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [statusFilters, setStatusFilters] = useState({
    ACTIVE: searchParams.getAll('status[]').includes('ACTIVE'),
    INACTIVE: searchParams.getAll('status[]').includes('INACTIVE'),
    SUSPENDED: searchParams.getAll('status[]').includes('SUSPENDED')
  })

  const isFiltered = searchParams.has('status[]')

  const handleStatusChange = (checked: boolean, status: string) => {
    setStatusFilters((prev) => ({
      ...prev,
      [status]: checked
    }))
  }

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('status[]')

    Object.entries(statusFilters).forEach(([status, checked]) => {
      if (checked) {
        params.append('status[]', status)
      }
    })

    router.push(`${pathname}?${params.toString()}`)
    setOpen(false)
  }

  const handleResetFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('status[]')

    setStatusFilters({
      ACTIVE: false,
      INACTIVE: false,
      SUSPENDED: false
    })

    router.push(`${pathname}?${params.toString()}`)
    setOpen(false)
  }
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className='w-full flex items-center justify-between p-3 text-foreground-800 hover:bg-muted'>
          <div className='flex items-center gap-2'>
            <div className='relative'>
              <Filter size={20} />
              <span
                className={cn(
                  'hidden absolute top-[-2.5px] right-[-2px] bg-brandcolora w-[10px] h-[10px] rounded-full',
                  isFiltered && 'block'
                )}
              />
            </div>
            <span>Filter</span>
          </div>
          <ChevronRight size={20} />
        </button>
      </DrawerTrigger>
      <DrawerContent className='max-h-[90svh] pb-6 px-4 rounded-t-[28px]'>
        <DrawerTitle className='sr-only'>Filter</DrawerTitle>
        <DrawerDescription className='sr-only'>
          Select filter conditions
        </DrawerDescription>

        <div className='flex flex-col overflow-y-auto'>
          <div className='px-3'>
            <p className='text-xs text-foreground font-medium py-2 mt-2'>
              STATUS
            </p>
            <div className='flex flex-col gap-[31px] py-2'>
              <FilterCheckbox
                label='Active'
                onChange={(checked) => handleStatusChange(checked, 'ACTIVE')}
                id='active'
                checked={statusFilters.ACTIVE}
              />
              <FilterCheckbox
                label='Inactive'
                onChange={(checked) => handleStatusChange(checked, 'INACTIVE')}
                id='inactive'
                checked={statusFilters.INACTIVE}
              />
              <FilterCheckbox
                label='Suspended'
                onChange={(checked) => handleStatusChange(checked, 'SUSPENDED')}
                id='suspended'
                checked={statusFilters.SUSPENDED}
              />
            </div>
          </div>
        </div>
        <div>
          <Button
            className='text-base font-medium w-full h-12 mt-6 hover:bg-brandcolora active:bg-brandcolora/80'
            onClick={handleApplyFilters}
          >
            Apply Filter
          </Button>
          <Button
            variant='outline'
            className='text-base font-medium w-full h-12 mt-6 bg-white text-foreground-800 hover:bg-transparent active:bg-brandcolora/10'
            onClick={handleResetFilters}
          >
            Reset
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default OrganizationFilterDrawer
