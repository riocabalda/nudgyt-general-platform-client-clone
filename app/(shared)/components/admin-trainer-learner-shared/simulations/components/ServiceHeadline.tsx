'use client'

import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { orgPrefixRoute } from '@/app/(shared)/utils'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import useGetSimulationResults from '../hooks/useGetSimulationResults'

function ServiceHeadline() {
  const { orgSlug, membership } = useOrganization()
  const { simulationServiceDetails } = useGetSimulationResults()

  const role = orgPrefixRoute(membership?.roles || [])

  return (
    <div className='flex justify-between items-center pr-4 gap-2'>
      <h1 className='text-xl lg:text-2xl font-semibold'>
        {simulationServiceDetails?.data?.service?.title}
      </h1>
      <Link
        href={`/${orgSlug}/${role?.toLowerCase()}/services/${simulationServiceDetails?.data?.service?._id}`}
        className='text-sm lg:text-base flex items-center gap-2 text-purple-shade-darkest2 text-nowrap'
      >
        Go to service <ArrowRightIcon className='size-4 text-sm' />
      </Link>
    </div>
  )
}

export default ServiceHeadline
