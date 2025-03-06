'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/app/(shared)/components/ui/dropdown-menu'
import { OrganizationStatus as OrganizationStatusType } from '@/app/(shared)/services/admin/organizationService'
import { cn } from '@/app/(shared)/utils'
import { ChevronDown } from 'lucide-react'
import useOrganizationsStore from '../../_hooks/useOrganizationsStore'

function OrganizationsBulkStatusDropdown() {
  const setSelectedStatus = useOrganizationsStore(
    (store) => store.setSelectedStatus
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='group'>
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
          onClick={() => setSelectedStatus(OrganizationStatusType.Active)}
        >
          Activate
        </DropdownMenuItem>
        <DropdownMenuItem
          className='focus:bg-neutral-gray-300 rounded-none px-3 py-2 cursor-pointer'
          onClick={() => setSelectedStatus(OrganizationStatusType.Inactive)}
        >
          Deactivate
        </DropdownMenuItem>
        <DropdownMenuItem
          className='focus:bg-neutral-gray-300 rounded-none px-3 py-2 cursor-pointer'
          onClick={() => setSelectedStatus(OrganizationStatusType.Suspended)}
        >
          Suspend
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default OrganizationsBulkStatusDropdown
