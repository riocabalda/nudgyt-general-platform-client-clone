import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/app/(shared)/components/ui/popover'
import { cn } from '@/app/(shared)/utils'
import { Copy, CopyCheck, Ellipsis } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import useOrganizationsStore from '../../../_hooks/useOrganizationsStore'
import AddOrganizationModal from '../../AddOrganizationModal'
import OrganizationFilterDrawer from '../OrganizationFilterDrawer'
import OrganizationSortDrawer from '../OrganizationSortDrawer'

enum Option {
  ADD_ORGANIZATION = 'addOrganization',
  SELECT_MULTIPLE = 'selectMultiple',
  SORT = 'sort',
  FILTER = 'filter'
}

function OrganizationActionPopover() {
  const { toggleMultipleCheckbox, showMultipleCheckbox } =
    useOrganizationsStore()
  const [openPopover, setOpenPopover] = useState(false)
  const [openActionPopOver, setActionPopOver] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const isFiltered = searchParams.has('status[]')

  const handleFilterSort = (value: string | null) => {
    setActionPopOver(value)
  }

  function closePopover() {
    setOpenPopover(false)
    setActionPopOver(null)
  }

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <button className='relative py-3 px-2 text-foreground-800'>
          <Ellipsis size={20} strokeWidth={1.5} />
          {isFiltered && (
            <span className='block absolute top-0 right-0 h-[10px] w-[10px] bg-brandcolora rounded-full' />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className='mt-[7px] w-[calc(100vw-2rem)] mx-4 px-0 py-2 lg:hidden'
        align='end'
      >
        <ul>
          <li
            className={
              openActionPopOver === Option.ADD_ORGANIZATION ? 'bg-muted' : ''
            }
            onClick={() => handleFilterSort(Option.ADD_ORGANIZATION)}
          >
            <AddOrganizationModal />
          </li>
          <li>
            <button
              className={cn(
                'w-full flex items-center gap-2 p-3 text-foreground-800 hover:bg-muted',
                openActionPopOver === Option.SELECT_MULTIPLE && 'bg-muted'
              )}
              onClick={() => {
                handleFilterSort(Option.SELECT_MULTIPLE)
                toggleMultipleCheckbox()
                setOpenPopover(false)
              }}
            >
              {showMultipleCheckbox ? (
                <CopyCheck size={20} />
              ) : (
                <Copy size={20} />
              )}
              <span>Select multiple</span>
            </button>
          </li>
          <li
            className={openActionPopOver === Option.SORT ? 'bg-muted' : ''}
            onClick={() => handleFilterSort(Option.SORT)}
          >
            <OrganizationSortDrawer onSort={closePopover} />
          </li>
          <li
            className={openActionPopOver === Option.FILTER ? 'bg-muted' : ''}
            onClick={() => handleFilterSort(Option.FILTER)}
          >
            <OrganizationFilterDrawer setOpen={setOpenPopover} />
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  )
}

export default OrganizationActionPopover
