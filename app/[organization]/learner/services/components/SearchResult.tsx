import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useGetServices } from '../hooks/useGetServices'
import { Loader } from 'lucide-react'
import ServiceList from './ServiceList'
import FetchError from '@/app/(shared)/components/FetchError'
import useOrganization from '@/app/(shared)/hooks/useOrganization'

function SearchResult() {
  const searchParams = useSearchParams()
  const { orgSlug } = useOrganization()
  const {
    data: servicesData,
    isLoading,
    error
  } = useGetServices(orgSlug, searchParams.toString())

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
    <div className='px-4 mt-4 lg:mt-10 lg:container lg:py-0 lg:px-[40px]'>
      <ServiceList
        servicesData={servicesData?.data}
        noServicesMessage={'No services found'}
      />
    </div>
  )
}

export default SearchResult
