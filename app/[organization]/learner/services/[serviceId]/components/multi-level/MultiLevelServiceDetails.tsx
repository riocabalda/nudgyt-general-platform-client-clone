'use client'

import React, { useEffect } from 'react'
import ServiceTypeBadge, {
  ServiceType
} from '@/app/(shared)/components/ServiceTypeBadge'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams
} from 'next/navigation'
import {
  Service,
  ServiceLevel
} from '@/app/(shared)/services/learner/serviceService'
import { Loader } from 'lucide-react'
import { Card } from '@/app/(shared)/components/ui/card'
import { useGetService } from '../../../hooks/useGetService'
import MultiLevel from './MultiLevel'
import SelectedLevel from './SelectedLevel'
import StartSimulationButton from '../StartSimulationButton'
import FetchError from '@/app/(shared)/components/FetchError'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useGetParamsFromURL from '@/app/(shared)/hooks/useGetParamsFromURL'

function MultiLevelServiceDetails() {
  const { serviceId } = useParams()
  const { orgSlug } = useOrganization()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const levelParams = searchParams.get('level')

  const { serviceData, isLoading, error } = useGetService(
    orgSlug,
    String(serviceId)
  )

  const serviceBadgeTitle =
    (levelParams !== '1' && String(levelParams) && `Level ${levelParams}`) || ''

  const levelArray = serviceData?.multi_level.map((_, i) => String(i + 1)) || []

  const { isURLTampered } = useGetParamsFromURL({ level: levelArray })

  const selectedLevelData =
    serviceData?.multi_level[parseInt(String(levelParams)) - 1]

  useEffect(() => {
    if (isURLTampered) {
      router.replace(`${pathname}`)
    }
  }, [isURLTampered])

  if (isURLTampered) return null

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

  const renderContent = () => {
    if (levelParams && selectedLevelData)
      return (
        <SelectedLevel
          selectedLevelData={selectedLevelData as ServiceLevel}
          levelArray={levelArray}
        />
      )
    return <MultiLevel serviceData={serviceData as Service} />
  }

  return (
    <div className='relative px-4 pb-20 mt-10 lg:mt-0 lg:container lg:px-10 lg:pb-0'>
      <ServiceTypeBadge
        title={serviceBadgeTitle ? serviceBadgeTitle : ''}
        serviceType={ServiceType.MultiLevel}
      />
      <h2 className='text-2xl font-semibold mt-4'>{serviceData?.title}</h2>

      <div>
        {serviceData?.multi_level.length ? (
          renderContent()
        ) : (
          <p className='mt-10 text-center'>No Multi-level data</p>
        )}
      </div>
      <Card className='lg:hidden rounded-none fixed bottom-0 right-0 w-full p-4 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]'>
        <StartSimulationButton />
      </Card>
    </div>
  )
}

export default MultiLevelServiceDetails
