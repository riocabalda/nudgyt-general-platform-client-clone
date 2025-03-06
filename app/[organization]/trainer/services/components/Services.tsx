'use client'

import React from 'react'
import { Loader, SearchX } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import ServiceCard, {
  ServiceCardType
} from '@/app/(shared)/components/ServiceCard'
import FetchError from '@/app/(shared)/components/FetchError'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useGetServices from '../hooks/useGetServices'

function Services() {
  const searchParams = useSearchParams()
  const hasAnyParams = searchParams.toString().length > 0
  const { orgSlug } = useOrganization()

  const { data, error, isLoading } = useGetServices(
    orgSlug,
    String(searchParams)
  )

  if (error)
    return (
      <div className='grid place-items-center p-4'>
        <FetchError errorMessage={error?.response?.data?.message} />
      </div>
    )

  if (isLoading)
    return (
      <div className='grid place-items-center p-4 h-full'>
        <Loader className='w-4 h-4 mr-2 animate-spin' />
      </div>
    )

  if (data && data.data.length)
    return (
      <ul className='grid gap-[24px] lg:grid-cols-3'>
        {data.data.map((service) => (
          <li data-cy='services' key={service._id}>
            <ServiceCard
              type={ServiceCardType.ADMIN}
              serviceData={service}
              link={`/${orgSlug}/trainer/services/${service._id}`}
            />
          </li>
        ))}
      </ul>
    )

  return (
    <div className='h-[500px] flex flex-col items-center justify-center'>
      <SearchX className='text-muted-foreground size-[24px]' />
      <p className='text-sm text-muted-foreground mt-[10px]'>
        {hasAnyParams ? 'No services found' : 'No services available'}
      </p>
    </div>
  )
}

export default Services
