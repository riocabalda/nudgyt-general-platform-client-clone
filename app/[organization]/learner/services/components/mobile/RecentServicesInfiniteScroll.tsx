'use client'

import React from 'react'
import { Loader, SearchX } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useInfiniteServices } from '../../hooks/useInfiniteServices'
import FetchError from '@/app/(shared)/components/FetchError'
import ServiceCard from '@/app/(shared)/components/ServiceCard'
import useOrganization from '@/app/(shared)/hooks/useOrganization'

function RecentServicesInfiniteScroll() {
  const { orgSlug } = useOrganization()
  const searchParams = useSearchParams()
  const search = searchParams.get('search')
  const sortBy = searchParams.get('sort_by')
  const view = searchParams.get('service_view') as 'recent' | 'new'

  const { servicesData, error, isLoading, isValidating, isTotalServices } =
    useInfiniteServices({
      orgSlug,
      view,
      search,
      sortBy
    })

  if (error)
    return (
      <div className='grid place-items-center p-4'>
        <FetchError errorMessage={error?.response?.data?.message} />
      </div>
    )

  if (isLoading)
    return (
      <div className='grid place-items-center p-4'>
        <Loader className='w-4 h-4 mr-2 animate-spin' />
      </div>
    )

  if (servicesData && servicesData.length)
    return (
      <ul className='grid gap-[24px] lg:grid-cols-3'>
        {servicesData.map((serviceData) => (
          <li key={serviceData._id}>
            <ServiceCard
              type='admin'
              serviceData={serviceData}
              link={`/${orgSlug}/admin/services/${serviceData._id}`}
            />
          </li>
        ))}
        {isValidating && !isTotalServices && (
          <li className='flex items-center justify-center gap-2'>
            <Loader className='w-4 h-4 mr-2 animate-spin' />
            <span>Loading more services...</span>
          </li>
        )}
      </ul>
    )

  return (
    <div className='h-[500px] flex flex-col items-center justify-center'>
      <SearchX className='text-neutral-gray-300 size-[24px]' />
      <p className='text-sm text-muted-foreground mt-[10px]'>
        No recent services
      </p>
    </div>
  )
}

export default RecentServicesInfiniteScroll
