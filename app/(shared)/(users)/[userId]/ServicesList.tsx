'use client'

import FetchError from '@/app/(shared)/components/FetchError'
import ServiceCard from '@/app/(shared)/components/ServiceCard'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { Service as ServiceAdmin } from '@/app/(shared)/services/admin/serviceService'
import { Service as ServiceLearner } from '@/app/(shared)/services/learner/serviceService'
import { ArrowRight, Loader, SearchX } from 'lucide-react'
import Link from 'next/link'

function ServicesList({
  serviceData,
  error,
  isLoading
}: {
  serviceData: ServiceAdmin[] | ServiceLearner[]
  error: any
  isLoading: boolean
}) {
  const { orgSlug } = useOrganization()

  function ServiceListContainer({ children }: { children: React.ReactNode }) {
    return (
      <div className='mt-10 px-4 lg:px-0'>
        <div className='flex justify-between items-center'>
          <h3 className='text-2xl font-semibold'>Recent Services</h3>
          <Link
            href={`/${orgSlug}/admin/services`}
            className='flex items-center gap-2 text-purple-shade-darkest2'
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6'>
          {children}
        </div>
      </div>
    )
  }

  if (error) return <FetchError errorMessage={error?.response?.data?.message} />

  if (isLoading)
    return (
      <ServiceListContainer>
        <div className='grid place-items-center p-4 col-span-full'>
          <Loader className='w-4 h-4 mr-2 animate-spin' />
        </div>
      </ServiceListContainer>
    )

  return (
    <ServiceListContainer>
      {!serviceData.length ? (
        <div className='flex flex-col items-center pt-4 lg:pt-32 col-span-full'>
          <SearchX className='text-neutral-gray-300' />
          <p className='text-[14px] font-[400]'>No recent cases</p>
        </div>
      ) : (
        serviceData.map((service: any) => (
          <ServiceCard
            key={service.id}
            serviceData={service}
            type='learner'
            link={`/${orgSlug}/admin/services/${service.id}`}
          />
        ))
      )}
    </ServiceListContainer>
  )
}

export default ServicesList
