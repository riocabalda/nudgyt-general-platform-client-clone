import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Loader } from 'lucide-react'
import { useGetServices } from '../hooks/useGetServices'
import Link from 'next/link'
import ServiceList from './ServiceList'
import FetchError from '@/app/(shared)/components/FetchError'
import useOrganization from '@/app/(shared)/hooks/useOrganization'

function ServicesPreview({
  title,
  href,
  filterView
}: {
  title: string
  href: string
  filterView: string
}) {
  const { orgSlug } = useOrganization()
  const {
    data: servicesData,
    isLoading,
    error
  } = useGetServices(orgSlug, `service_view=${filterView}`)

  const renderThreeServices = servicesData?.data?.slice(0, 3) || []
  const hasServices = !!servicesData?.data?.length

  const noServicesMessage = `No ${filterView} services`

  const render = () => {
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
      <ServiceList
        servicesData={renderThreeServices}
        noServicesMessage={noServicesMessage}
      />
    )
  }

  return (
    <div className='space-y-6 w-full'>
      <div className='flex items-center justify-between'>
        <h1 className='text-foreground text-base lg:text-2xl font-semibold'>
          {title}
        </h1>
        {hasServices && (
          <Link
            href={href}
            className='flex items-center gap-[10px] text-brandcolora text-sm lg:text-base lg:font-medium'
          >
            <span>See All</span>
            <ArrowRight size={16} strokeWidth={1.5} />
          </Link>
        )}
      </div>
      {render()}
    </div>
  )
}

export default ServicesPreview
