'use client'

import React from 'react'
import ServiceTypeBadge, {
  ServiceType
} from '@/app/(shared)/components/ServiceTypeBadge'
import { Card } from '@/app/(shared)/components/ui/card'
import { Service } from '@/app/(shared)/services/learner/serviceService'
import CharacterProfile from '../CharacterProfile'
import Environment from '../Environment'
import StartSimulationButton from '../StartSimulationButton'
import PreviousAttemptCard from '../PreviousAttemptCard'

function BasicServiceDetails({ serviceData }: { serviceData: Service }) {
  return (
    <div className='max-w-[712px] mx-auto  px-4 pb-20 mt-10 lg:mt-0 lg:pb-0'>
      <div>
        <ServiceTypeBadge serviceType={ServiceType.Basic} />
        <h2 className='text-2xl font-semibold mt-4'>
          {serviceData.basic_level.title}
        </h2>
      </div>

      <PreviousAttemptCard />

      <Card className='flex flex-col gap-6 p-4 lg:p-6 mt-6'>
        <div>
          <h2 className='text-lg font-semibold'>Description</h2>
          <p className='mt-4 text-sm text-muted-foreground'>
            {serviceData.basic_level.description}
          </p>
        </div>

        <hr className='border-t border-neutral-gray-400' />

        <CharacterProfile characters={serviceData.basic_level.characters} />

        <hr className='border-t border-neutral-gray-400' />

        <Environment
          serviceEnvironmentData={serviceData.basic_level.environment}
        />
      </Card>
      <Card className='lg:hidden rounded-none fixed bottom-0 right-0 w-full p-4 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]'>
        <StartSimulationButton />
      </Card>
    </div>
  )
}

export default BasicServiceDetails
