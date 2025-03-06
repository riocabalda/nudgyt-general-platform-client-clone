'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/app/(shared)/components/ui/dropdown-menu'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { formatDateTime, orgPrefixRoute } from '@/app/(shared)/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { Fragment } from 'react'
import useGetSimulationResults from '../hooks/useGetSimulationResults'

function SimulationLinksDropdown() {
  const {
    simulationDates,
    simulationServiceDetails,
    isSimulationDatesLoading
  } = useGetSimulationResults()
  const { orgSlug, membership } = useOrganization()
  const role = orgPrefixRoute(membership?.roles || [])

  function createSimResultHref(
    simId: string,
    deviceType: 'desktop' | 'mobile'
  ) {
    return `/${orgSlug}/${role?.toLowerCase()}/simulations/${simId}/results?device=${deviceType}`
  }

  if (simulationDates?.data?.dates?.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='group'>
        <Button
          variant='ghost'
          size='sm'
          className='flex gap-2 items-center text-neutral-gray-800 text-sm lg:text-base font-medium lg:font-semibold'
          disabled={isSimulationDatesLoading}
        >
          <span>
            {simulationDates?.data?.dates?.find((date) => date.isSelected)
              ?.date &&
              formatDateTime(
                simulationDates?.data?.dates?.find((date) => date.isSelected)
                  ?.date || ''
              )}
          </span>
          <div className='grid *:row-[1] *:col-[1]'>
            <ChevronUp className='size-3 lg:size-4 transition group-data-[state=open]:opacity-100 group-data-[state=closed]:opacity-0' />
            <ChevronDown className='size-3 lg:size-4 transition group-data-[state=open]:opacity-0 group-data-[state=closed]:opacity-100' />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='max-h-48 overflow-y-auto scrollbar-thin'>
        <DropdownMenuLabel>Simulation attempts</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {simulationDates?.data?.dates?.map((sim: any) => (
          <Fragment key={sim.id}>
            <DropdownMenuItem
              asChild
              disabled={sim.id === simulationServiceDetails?.data?.simulationId}
              className='hidden lg:block'
            >
              {sim.date !== null && (
                <Link href={createSimResultHref(sim.id, 'desktop')}>
                  {formatDateTime(sim.date || '')}
                </Link>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              disabled={sim.id === simulationServiceDetails?.data?.simulationId}
              className='lg:hidden'
            >
              {sim.date !== null && (
                <Link href={createSimResultHref(sim.id, 'mobile')}>
                  {formatDateTime(sim.date || '')}
                </Link>
              )}
            </DropdownMenuItem>
          </Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SimulationLinksDropdown
