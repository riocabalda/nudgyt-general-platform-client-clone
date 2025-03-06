import { Button } from '@/app/(shared)/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/app/(shared)/components/ui/dropdown-menu'
import { cn } from '@/app/(shared)/utils'
import { ChevronDown } from 'lucide-react'
import useOrganizationUserStore from '../_hooks/useOrganizationUserStore'

function SelectedUsersDropdown() {
  const setSelectedStatus = useOrganizationUserStore(
    (store) => store.setSelectedStatus
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className='outline-none flex items-center gap-[10px] ml-auto'
      >
        <Button
          variant='outline'
          className='!px-8 bg-white flex items-center justify-center gap-[10px] border-brandcolora border-2 text-brandcolora'
        >
          <span>Set Status</span>
          <ChevronDown
            className={cn(
              'size-4',
              'transition group-data-[state=open]:-rotate-180'
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='px-0 min-w-[358px] fixed top-3 -right-[1px] lg:fixed lg:w-full lg:min-w-[137px]'
        align='end'
      >
        <DropdownMenuItem
          className='focus:bg-neutral-gray-300 rounded-none px-3 py-2 cursor-pointer'
          onClick={() => setSelectedStatus('approve')}
        >
          Approve
        </DropdownMenuItem>
        <DropdownMenuItem
          className='focus:bg-neutral-gray-300 rounded-none px-3 py-2 cursor-pointer'
          onClick={() => setSelectedStatus('unblock')}
        >
          Unblock
        </DropdownMenuItem>
        <DropdownMenuItem
          className='focus:bg-neutral-gray-300 rounded-none px-3 py-2 cursor-pointer'
          onClick={() => setSelectedStatus('block')}
        >
          Block
        </DropdownMenuItem>
        <DropdownMenuItem
          className='focus:bg-neutral-gray-300 rounded-none px-3 py-2 cursor-pointer'
          onClick={() => setSelectedStatus('archive')}
        >
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SelectedUsersDropdown
