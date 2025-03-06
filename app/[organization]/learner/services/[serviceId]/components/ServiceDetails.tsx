'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { ServiceTypeEnum } from '@/app/(shared)/types'
import { Loader } from 'lucide-react'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import BasicServiceDetails from './basic/BasicServiceDetails'
import MultiLevelServiceDetails from './multi-level/MultiLevelServiceDetails'
import FetchError from '@/app/(shared)/components/FetchError'
import { useGetService } from '../../hooks/useGetService'

function ServiceDetails() {
  const { serviceId } = useParams()
  const { orgSlug } = useOrganization()
  const { serviceData, isLoading, error } = useGetService(
    orgSlug,
    String(serviceId)
  )

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
    <div>
      {serviceData?.service_type.type === ServiceTypeEnum.BASIC ? (
        <BasicServiceDetails serviceData={serviceData} />
      ) : (
        <MultiLevelServiceDetails />
      )}
    </div>
  )
}

export default ServiceDetails
