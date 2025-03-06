import { ChevronRight, Filter } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Dispatch, SetStateAction, useState } from 'react'
import { Button } from '../../components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerTrigger
} from '../../components/ui/drawer'
import useUser from '../../hooks/useUser'
import { cn, isPathIncluded } from '../../utils'
import { FilterCheckbox } from '../FilterPopover'

function FilterDrawer({
  setOpen
}: {
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
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

  const [userTypeFilters, setUserTypeFilters] = useState({
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

  const handleUserTypeChange = (checked: boolean, userType: string) => {
    setUserTypeFilters((prev) => ({
      ...prev,
      [userType]: checked
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

    Object.entries(userTypeFilters).forEach(([userType, checked]) => {
      if (checked) {
        params.append('role[]', userType)
      }
    })

    router.push(`${pathname}?${params.toString()}`)
    setOpen(false)
  }

  const handleResetFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('status[]')
    params.delete('role[]')

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
        <div className='flex flex-col overflow-y-auto'>
          <div className='px-3'>
            <p className='text-xs text-foreground font-medium py-2 mt-2'>
              VERIFICATION
            </p>
            <div className='flex flex-col gap-[31px] py-2'>
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
            <div className='px-3'>
              <p className='text-xs text-foreground font-medium py-2 mt-2'>
                USER TYPE
              </p>
              <div className='flex flex-col gap-[31px] py-2'>
                <FilterCheckbox
                  label='Admin'
                  onChange={(checked) => handleUserTypeChange(checked, 'Admin')}
                  id='admin'
                  checked={userTypeFilters.Admin}
                />
                <FilterCheckbox
                  label='Trainer'
                  onChange={(checked) =>
                    handleUserTypeChange(checked, 'Trainer')
                  }
                  id='trainer'
                  checked={userTypeFilters.Trainer}
                />
                <FilterCheckbox
                  label='Learner'
                  onChange={(checked) =>
                    handleUserTypeChange(checked, 'Learner')
                  }
                  id='learner'
                  checked={userTypeFilters.Learner}
                />
              </div>
            </div>
          )}
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

export default FilterDrawer
