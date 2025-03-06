import React from 'react'
import { cn } from '@/app/(shared)/utils'
import { Card } from '@/app/(shared)/components/ui/card'
import {
  ArrowUpNarrowWide,
  Loader,
  SearchX,
  SquareUser,
  Star
} from 'lucide-react'
import FetchError from '@/app/(shared)/components/FetchError'
import NextStepButton from './NextStepButton'
import ContactButton from './ContactButton'
import PrevStepButton from './PrevStepButton'
import useSWR from 'swr'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import serviceService from '@/app/(shared)/services/trainer/serviceService'
import { useServiceStore } from '../hooks/useServiceStore'

function ServiceType() {
  const { orgSlug } = useOrganization()
  const { serviceTypeId, setServiceTypeId } = useServiceStore()

  const {
    data: serviceTypeData,
    isLoading,
    error
  } = useSWR(`${orgSlug}/trainer/services/service-types`, () =>
    serviceService.getServiceTypes(orgSlug).then((res) => res.data)
  )

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

  if (!serviceTypeData || serviceTypeData.length === 0)
    return (
      <div className='h-[500px] flex flex-col items-center justify-center'>
        <SearchX className='text-neutral-gray-300 size-[24px]' />
        <p className='text-sm text-muted-foreground mt-[10px]'>
          No Service Types available
        </p>
      </div>
    )

  const serviceIcon = (type: string) => {
    switch (type) {
      case 'BASIC':
        return (
          <SquareUser
            className='size-[80px] text-brandcolora'
            strokeWidth={1}
          />
        )
      case 'MULTI-LEVEL':
        return (
          <ArrowUpNarrowWide
            className='size-[80px] text-brandcolora'
            strokeWidth={1}
          />
        )
      case 'CUSTOM':
        return <Star className='size-[80px] text-brandcolora' strokeWidth={1} />
    }
  }

  return (
    <div className='px-4 lg:px-0 pt-0 lg:py-[40px] max-w-[712px] mx-auto'>
      <h2 className='text-base font-normal lg:text-[24px] lg:font-semibold'>
        Select Service Type
      </h2>
      <Card className='grid grid-cols-1 lg:grid-cols-3 gap-[24px] p-[16px] mt-[40px] bg-white rounded-[8px] min-h-[400px] min-w-[200px]'>
        {serviceTypeData.data
          .sort((a: any, b: any) => {
            type ServiceTypeKey = 'BASIC' | 'MULTI-LEVEL' | 'CUSTOM'
            const order = { BASIC: 1, 'MULTI-LEVEL': 2, CUSTOM: 3 }
            return (
              order[a.type as ServiceTypeKey] - order[b.type as ServiceTypeKey]
            )
          })
          .map((serviceType: any) => (
            <button
              key={serviceType._id}
              onClick={() => setServiceTypeId(serviceType._id)}
              className={cn(
                'cursor-pointer rounded-[8px] p-4 border border-neutral-300 flex flex-col gap-4 ring-offset-2 h-full',
                serviceTypeId === serviceType._id &&
                  'ring-2 ring-offset-0 ring-brandcolora bg-primary-100',
                (serviceType.type === 'CUSTOM' ||
                  serviceType.type === 'MULTI-LEVEL') &&
                  'opacity-50'
              )}
              disabled={
                serviceType.type === 'CUSTOM' ||
                serviceType.type === 'MULTI-LEVEL'
              }
            >
              <div className='flex flex-col h-full gap-4'>
                {serviceIcon(serviceType.type)}
                <h3 className='font-semibold text-left'>{serviceType.name}</h3>
                <p className='text-sm text-muted-foreground text-left'>
                  {serviceType.description}
                </p>
                {serviceType.type === 'CUSTOM' && (
                  <div className='mt-auto pt-4'>
                    <ContactButton />
                  </div>
                )}
              </div>
            </button>
          ))}
      </Card>
      <div className='mt-[24px] flex items-center justify-between'>
        <PrevStepButton prevStep={0} />
        <NextStepButton nextStep={1} disabled={!serviceTypeId} />
      </div>
    </div>
  )
}

export default ServiceType
