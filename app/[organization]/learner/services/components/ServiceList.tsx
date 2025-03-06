import React from 'react'
import { SearchX } from 'lucide-react'
import ServiceCard from '@/app/(shared)/components/ServiceCard'
import useOrganization from '@/app/(shared)/hooks/useOrganization'

function ServiceList({
  servicesData,
  noServicesMessage
}: {
  servicesData: any
  noServicesMessage: string
}) {
  const { orgSlug } = useOrganization()
  return (
    <ul className='space-y-[24px]'>
      {servicesData?.length ? (
        <li className='grid gap-[24px] lg:grid-cols-3'>
          {servicesData?.map((serviceData: any) => (
            <div data-cy='services' key={serviceData._id}>
              <ServiceCard
                type='learner'
                serviceData={serviceData}
                link={`/${orgSlug}/learner/services/${serviceData._id}`}
              />
            </div>
          ))}
        </li>
      ) : (
        <li className='h-[260px] flex flex-col items-center justify-center'>
          <SearchX className='text-neutral-gray-300 size-[24px]' />
          <p className='text-sm text-muted-foreground mt-[10px]'>
            {noServicesMessage}
          </p>
        </li>
      )}
    </ul>
  )
}

export default ServiceList
