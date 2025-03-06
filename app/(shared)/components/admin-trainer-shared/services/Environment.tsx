import React from 'react'
import { RichText } from '@/app/(shared)/components/ui/rich-text'
import { Service } from '@/app/(shared)/services/admin/serviceService'
import Image from 'next/image'
import DOMPurify from 'dompurify'
import { Template } from '@/app/(shared)/services/admin/templateService'

function Environment({
  serviceData,
  isTemplate = false
}: {
  serviceData: Service | Template
  isTemplate?: boolean
}) {
  const environment = isTemplate
    ? (serviceData as Template).environment
    : (serviceData as Service).basic_level.environment

  return (
    <div className='grid grid-cols-1 lg:grid-cols-5 gap-6 rounded-[8px]'>
      {environment ? (
        <>
          <div className='w-full pb-[35.5%] lg:pb-[54%] col-span-3 lg:col-span-2 bg-muted relative'>
            <Image
              src={environment?.image}
              fill
              alt={environment?.location}
              quality='100'
              className='absolute object-cover'
            />
          </div>
          <div className='col-span-3'>
            <div className='flex items-start justify-between'>
              <p className='text-lg font-semibold'>{environment?.location}</p>
            </div>
            <div className='mt-4 service-details-rtk'>
              <RichText
                readOnly={true}
                value={DOMPurify.sanitize(environment?.description)}
              />
            </div>
          </div>
        </>
      ) : (
        <span className='text-destructive text-sm col-span-2'>
          No environment selected
        </span>
      )}
    </div>
  )
}

export default Environment
