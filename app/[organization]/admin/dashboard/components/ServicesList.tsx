'use client'
import ServiceCard from '@/app/(shared)/components/ServiceCard'
import Link from 'next/link'
import { ArrowRight, SearchX, Loader } from 'lucide-react'
import useSWR from 'swr'
import dashboardService from '@/app/(shared)/services/admin/dashboardService'
import FetchError from '@/app/(shared)/components/FetchError'
import useOrganization from '@/app/(shared)/hooks/useOrganization'

const ServicesList = () => {
  const { orgSlug } = useOrganization()
  const {
    data: services,
    isLoading,
    error
  } = useSWR(`${orgSlug}/admin/services/recent`, () =>
    dashboardService
      .getRecentServices({ isRecent: true, orgSlug })
      .then((res) => res.data)
  )

  const ServiceListContainer: React.FC<{ children: React.ReactNode }> = ({
    children
  }) => {
    return (
      <div className='mt-10'>
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
      {!services?.data?.data?.length ? (
        <div className='flex flex-col items-center pt-4 lg:pt-32 col-span-full'>
          <SearchX className='text-neutral-gray-300 text-muted-foreground' />
          <p className='text-[14px] font-[400] text-muted-foreground mt-2'>
            No recent services
          </p>
        </div>
      ) : (
        services.data.data.map((service: any) => (
          <ServiceCard
            key={service.id}
            serviceData={service}
            type='admin'
            link={`/${orgSlug}/admin/services/${service.id}`}
          />
        ))
      )}
    </ServiceListContainer>
  )
}

export default ServicesList
