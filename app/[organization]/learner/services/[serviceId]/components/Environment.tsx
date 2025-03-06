import React from 'react'
import { RichText } from '@/app/(shared)/components/ui/rich-text'
import { Environment as EnvironmentType } from '@/app/(shared)/services/learner/serviceService'
import Image from 'next/image'
import DOMPurify from 'dompurify'

function Environment({
  serviceEnvironmentData
}: {
  serviceEnvironmentData: EnvironmentType
}) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-5 gap-[24px] rounded-[8px]'>
      <div className='w-full pb-[35.5%] lg:pb-[54%] col-span-3 lg:col-span-2 bg-muted relative'>
        <Image
          src={serviceEnvironmentData.image ?? ''}
          fill
          alt={serviceEnvironmentData.location ?? ''}
          quality='100'
          className='absolute object-cover'
        />
      </div>
      <div className='col-span-3'>
        <div className='flex items-start justify-between'>
          <p className='text-lg font-semibold'>
            {serviceEnvironmentData.location}
          </p>
        </div>
        <div className='mt-4 service-details-rtk'>
          <RichText
            readOnly={true}
            value={DOMPurify.sanitize(serviceEnvironmentData.description || '')}
          />
        </div>
      </div>
    </div>
  )
}

export default Environment
