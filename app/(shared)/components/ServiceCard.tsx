import React from 'react'
import { ChevronRight } from 'lucide-react'
import { Card } from './ui/card'
import { formatDateTime } from '../utils'
import { Service as ServiceAdmin } from '../services/admin/serviceService'
import { Service as ServiceLearner } from '../services/learner/serviceService'
import { ServiceTypeEnum } from '../types'
import Link from 'next/link'
import Image from 'next/image'
import ServiceStatusBadge from './admin/ServiceStatusBadge'
import useUser from '../hooks/useUser'
export enum ServiceCardType {
  ADMIN = 'admin',
  TRAINER = 'trainer',
  LEARNER = 'learner'
}
type ServiceCardProps = {
  serviceData: ServiceAdmin | ServiceLearner
  type: 'admin' | 'trainer' | 'learner'
  link: string
}
function ServiceCard({ serviceData, type, link }: ServiceCardProps) {
  const { user } = useUser()
  const serviceType =
    serviceData.multi_level?.length > 0 ? 'MULTI-LEVEL' : 'BASIC'
  const isShowSaveBadge =
    type === ServiceCardType.LEARNER &&
    serviceData &&
    'last_paused_at' in serviceData &&
    serviceData?.last_paused_at
  const simulationStartedAt = serviceData?.simulations
    ?.filter((simulation) => !simulation.is_trial_data)
    ?.map((simulation) => simulation.started_at)[0]
  const isCreator = serviceData?.creator?._id === user?._id

  return (
    <Link href={link}>
      <Card className='overflow-hidden flex flex-col h-full'>
        <div className='relative pb-[32%]'>
          {isShowSaveBadge && (
            <ServiceStatusBadge
              variant={'saved'}
              className='absolute z-[1] right-4 top-4'
            />
          )}
          {type === ServiceCardType.ADMIN && isCreator && (
            <ServiceStatusBadge
              variant={serviceData?.is_published ? 'published' : 'draft'}
              className='absolute z-[3] right-4 top-4'
            />
          )}

          <div className='absolute flex justify-start bottom-0 left-[10%] gap-2 w-[70%] h-3/4 z-[2]'>
            {serviceType === ServiceTypeEnum.BASIC &&
              serviceData?.basic_level?.characters.length > 0 &&
              serviceData?.basic_level?.characters.map(
                (character) =>
                  character.avatar && (
                    <div
                      key={character.avatar._id}
                      className='relative w-full overflow-hidden'
                    >
                      <Image
                        src={character.avatar.image_path ?? ''}
                        fill
                        alt={character.name ?? ''}
                        className='object-contain z-[2] !w-auto'
                      />
                    </div>
                  )
              )}
          </div>

          {serviceType === ServiceTypeEnum.BASIC &&
          serviceData?.basic_level?.environment?.image ? (
            <Image
              src={serviceData.basic_level.environment.image ?? ''}
              fill
              alt='Environment image'
              className='absolute object-cover brightness-[.6]'
            />
          ) : (
            <div className='bg-muted w-full h-full absolute' />
          )}
        </div>
        <div className='p-4 flex flex-col h-full'>
          <div className='flex justify-between grow'>
            <h2 className='font-semibold line-clamp-2'>
              {serviceData?.title || (
                <span className='text-destructive uppercase'>
                  No Service Title
                </span>
              )}
            </h2>
            <ChevronRight className='text-muted-foreground shrink-0' />
          </div>
          <div className='flex items-end justify-between'>
            <div>
              <p className='mt-4 text-neutral-gray-800 font-medium text-xs leading-none'>
                {type === ServiceCardType.ADMIN && 'CREATED'}
                {type === ServiceCardType.LEARNER &&
                  (isShowSaveBadge ? 'SAVED' : 'LAST ATTEMPT')}
              </p>
              <p className='mt-1 text-sm text-neutral-gray-600'>
                {type === ServiceCardType.ADMIN &&
                  serviceData?.created_at &&
                  formatDateTime(serviceData?.created_at)}
                {
                  type === ServiceCardType.LEARNER &&
                    (isShowSaveBadge
                      ? formatDateTime(String(serviceData?.last_paused_at)) // Render last paused date if it's simulated and it saved
                      : simulationStartedAt
                        ? formatDateTime(String(simulationStartedAt)) // Render simulation start date if it's simulated and it not yet saved
                        : '-') // Render '-' if it's not yet simulated
                }
              </p>
              {type === (ServiceCardType.ADMIN || ServiceCardType.TRAINER) &&
                serviceData.creator && (
                  <p className='text-sm text-neutral-gray-600'>
                    {`by ${serviceData?.creator?.full_name}`}
                  </p>
                )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
export default ServiceCard
