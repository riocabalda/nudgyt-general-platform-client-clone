import React from 'react'
import { SERVICE_VIEW } from '../constants'
import { useGetServices } from '../hooks/useGetServices'
import { useSearchParams } from 'next/navigation'
import { Loader } from 'lucide-react'
import FetchError from '@/app/(shared)/components/FetchError'
import ServiceList from './ServiceList'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import ServicesInfiniteScroll from './mobile/ServicesInfiniteScroll'

type ServiceViewType = (typeof SERVICE_VIEW)[keyof typeof SERVICE_VIEW]

function ServicesView({
  serviceViewValue
}: {
  serviceViewValue: ServiceViewType
}) {
  const { orgSlug } = useOrganization()
  const searchParams = useSearchParams()
  const {
    data: servicesData,
    isLoading,
    error
  } = useGetServices(orgSlug, searchParams.toString())

  const noServicesMessage = serviceViewValue
    ? `No ${serviceViewValue} services`
    : 'No services'

  if (error)
    return (
      <div className='h-[230px] grid place-items-center p-4'>
        <FetchError errorMessage={error?.response?.data?.message} />
      </div>
    )

  if (isLoading)
    return (
      <div className='h-[230px] grid place-items-center p-4'>
        <Loader className='w-4 h-4 mr-2 animate-spin' />
      </div>
    )

  return (
    <>
      <div className='hidden lg:block px-4 mt-4 lg:mt-10 lg:container lg:py-0 lg:px-[40px]'>
        <ServiceList
          servicesData={servicesData?.data}
          noServicesMessage={noServicesMessage}
        />
      </div>
      <div className='lg:hidden px-4 mt-4'>
        <ServicesInfiniteScroll noServicesMessage={noServicesMessage} />
      </div>
    </>
  )
}

export default ServicesView
