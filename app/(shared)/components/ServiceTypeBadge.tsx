import React from 'react'
import { cn } from '../utils'
import { ArrowUpNarrowWide, SquareUser } from 'lucide-react'

export enum ServiceType {
  Basic = 'Basic',
  MultiLevel = 'Multi-level'
}

type ServiceTypeProps = {
  serviceType: ServiceType
  className?: string
  title?: string
}

function ServiceTypeBadge({ serviceType, className, title }: ServiceTypeProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {serviceType === ServiceType.Basic ? (
        <>
          <SquareUser size={20} strokeWidth={1.5} className='text-gray-800' />
          <h3 className='text-sm text-gray-800 font-medium'>
            {title ? title : 'Basic Service'}
          </h3>
        </>
      ) : (
        <>
          <div className='flex items-center gap-2'>
            <ArrowUpNarrowWide size={20} strokeWidth={1.5} />
            <span className='text-sm font-medium'>
              {title ? title : 'Multi-level Service'}
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default ServiceTypeBadge
