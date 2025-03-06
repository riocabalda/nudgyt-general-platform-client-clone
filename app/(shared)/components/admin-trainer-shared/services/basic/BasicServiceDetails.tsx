'use client'

import React, { ReactNode } from 'react'
import ServiceTypeBadge, {
  ServiceType
} from '@/app/(shared)/components/ServiceTypeBadge'
import { cn } from '@/app/(shared)/utils'
import { Card } from '@/app/(shared)/components/ui/card'
import { Service } from '@/app/(shared)/services/admin/serviceService'
import { VoiceType } from '@/app/(shared)/services/admin/characterService'
import CharacterProfile from '../CharacterProfile'
import Environment from '../Environment'

function BasicServiceDetails({
  serviceData,
  headerActions,
  tabs,
  voiceTypes
}: {
  serviceData: Service
  headerActions: ReactNode
  tabs: ReactNode
  voiceTypes: VoiceType[]
}) {
  return (
    <>
      <div className='flex flex-col gap-4 lg:gap-6 px-4 lg:px-10 py-10 max-w-[712px] mx-auto'>
        <div>
          <ServiceTypeBadge serviceType={ServiceType.Basic} />
          <div className='flex items-center justify-between pr-[24px] mt-4'>
            <h2 className='text-[24px] font-semibold'>
              {serviceData.basic_level.title ? (
                serviceData.basic_level.title
              ) : (
                <span className='text-destructive'>No service title</span>
              )}
            </h2>
          </div>

          <div
            className={cn(
              `mt-4 w-fit  font-medium text-xs text-white p-[6px] rounded-sm bg-success leading-none`,
              !serviceData.is_published && 'bg-neutral-gray-600'
            )}
          >
            {serviceData.is_published ? 'PUBLISHED' : 'DRAFT'}
          </div>
        </div>

        <div className='lg:hidden mt-6 lg:mt-4'>{headerActions}</div>

        <Card className='flex flex-col gap-6 rounded-[8px] p-4 lg:p-[24px]'>
          <div>
            <div className='flex items-start justify-between'>
              <h2 className='text-lg font-semibold'>Description</h2>
            </div>
            <p className='mt-4 text-sm text-muted-foreground'>
              {serviceData.basic_level.description ? (
                serviceData.basic_level.description
              ) : (
                <span className='text-destructive'>No service description</span>
              )}
            </p>
          </div>

          <hr className='border-t border-neutral-gray-400' />

          <CharacterProfile serviceData={serviceData} voiceTypes={voiceTypes} />

          <hr className='border-t border-neutral-gray-400' />

          <Environment serviceData={serviceData} />
        </Card>
      </div>
      {tabs}
    </>
  )
}

export default BasicServiceDetails
