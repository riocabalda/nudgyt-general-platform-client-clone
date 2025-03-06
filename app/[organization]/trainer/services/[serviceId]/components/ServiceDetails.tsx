'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { Loader } from 'lucide-react'
import { ServiceTypeEnum } from '@/app/(shared)/types'
import useSWR from 'swr'
import HeaderActions from './HeaderAction'
import useGetService from '../hooks/useGetService'
import FetchError from '@/app/(shared)/components/FetchError'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import characterService from '@/app/(shared)/services/trainer/characterService'
import MultiLevelServiceDetails from '@/app/(shared)/components/admin-trainer-shared/services/multi-level/MultiLevelServiceDetails'
import BasicServiceDetails from '@/app/(shared)/components/admin-trainer-shared/services/basic/BasicServiceDetails'
import Tabs from './Tabs'

function ServiceDetails() {
  const { orgSlug } = useOrganization()
  const { serviceId } = useParams()

  const { data } = useSWR(`${orgSlug}/trainer/characters/voice-types`, () =>
    characterService.getCharacterVoiceTypes(orgSlug).then((res) => res.data)
  )

  const { serviceData, isLoading, error } = useGetService(
    orgSlug,
    String(serviceId)
  )
  const voiceTypes = Array.isArray(data?.data) ? data?.data : []

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

  return (
    <>
      {serviceData?.service_type.type === ServiceTypeEnum.BASIC ? (
        <BasicServiceDetails
          serviceData={serviceData}
          headerActions={<HeaderActions />}
          voiceTypes={voiceTypes}
          tabs={<Tabs />}
        />
      ) : (
        serviceData && (
          <MultiLevelServiceDetails
            serviceData={serviceData}
            headerActions={<HeaderActions />}
            tabs={<Tabs isMultiLevelService={true} />}
          />
        )
      )}
    </>
  )
}

export default ServiceDetails
