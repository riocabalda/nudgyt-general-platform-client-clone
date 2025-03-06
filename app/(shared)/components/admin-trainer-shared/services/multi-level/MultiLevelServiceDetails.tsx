'use client'

import React, { ReactNode } from 'react'
import ServiceTypeBadge, {
  ServiceType
} from '@/app/(shared)/components/ServiceTypeBadge'
import { Card } from '@/app/(shared)/components/ui/card'
import { cn } from '@/app/(shared)/utils'
import { Service } from '@/app/(shared)/services/admin/serviceService'
import Image from 'next/image'
import MultiLevelCard from './MultiLevelCard'

function MultiLevelServiceDetails({
  serviceData,
  headerActions,
  tabs
}: {
  serviceData: Service
  headerActions: ReactNode
  tabs: ReactNode
}) {
  return (
    <>
      <div className='flex flex-col py-10 gap-4 lg:gap-6 px-4 lg:px-10 max-w-[824px] mx-auto'>
        <Card className='overflow-hidden'>
          <div className='relative w-full aspect-[824/250] bg-neutral-400'>
            <Image
              src={serviceData.cover_image ?? ''}
              fill
              alt={serviceData.title ?? ''}
              quality='100'
              className='absolute object-cover'
            />
            <div className='absolute inset-0 flex flex-col justify-between sm:justify-end p-4 gap-0 sm:gap-4'>
              <ServiceTypeBadge
                className='text-white'
                serviceType={ServiceType.MultiLevel}
              />
              <h2 className='text-white text-base lg:text-2xl font-semibold'>
                {serviceData.title ? (
                  serviceData.title
                ) : (
                  <span className='text-destructive'>No service title</span>
                )}
              </h2>
              <div
                className={cn(
                  `w-fit  font-medium text-xs text-white p-[6px] rounded-sm bg-success leading-none`,
                  !serviceData.is_published && 'bg-neutral-gray-600'
                )}
              >
                {serviceData.is_published ? 'PUBLISHED' : 'DRAFT'}
              </div>
            </div>
          </div>
        </Card>

        <div className='lg:hidden mt-6'>{headerActions}</div>

        <Card className='p-4'>
          <h2 className='text-lg font-semibold'>Description</h2>
          <p className='mt-4 text-sm text-muted-foreground'>
            {serviceData.description ? (
              serviceData.description
            ) : (
              <span className='text-destructive'>No service description</span>
            )}
          </p>
        </Card>
        {serviceData.is_published ? (
          <Card className='p-4 lg:p-6 grid grid-cols-1'>
            {serviceData.multi_level.map((data, i) => (
              <div key={data._id}>
                <MultiLevelCard
                  multiLevelData={data}
                  isPublished={serviceData.is_published}
                  level={i + 1}
                />
                {i !== serviceData.multi_level.length - 1 && (
                  <div className='flex justify-between w-[10px] h-12 mx-auto'>
                    <span className='w-[2px] h-full bg-[#F27405]' />
                    <span className='w-[2px] h-full bg-[#005AC8]' />
                  </div>
                )}
              </div>
            ))}
          </Card>
        ) : (
          <Card className='p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6'>
            {serviceData.multi_level.map((data, i) => (
              <MultiLevelCard
                key={data._id}
                multiLevelData={data}
                isPublished={serviceData.is_published}
                level={i + 1}
              />
            ))}
          </Card>
        )}
      </div>
      {tabs}
    </>
  )
}

export default MultiLevelServiceDetails
