'use client'

import { Card } from '@/app/(shared)/components/ui/card'
import { cn } from '@/app/(shared)/utils'
import useGetSimulationResults from '../../hooks/useGetSimulationResults'
import CompletedTimeCard from '../cards/CompletedTimeCard'
import OverallScoreCard from '../cards/OverallScoreCard'
import ServiceDescriptionCard from '../cards/ServiceDescriptionCard'
import SoftSkillsCard from '../cards/SoftSkillsCard'

function ServiceDetailsTab() {
  const { details } = useGetSimulationResults()

  return (
    <div>
      <Card className='p-6'>
        <h1 className='text-lg font-semibold'>Transcript Summary</h1>
        {details?.transcriptSummary ? (
          <p className='text-sm text-neutral-gray-600 mt-4'>
            {details?.transcriptSummary}
          </p>
        ) : (
          <p className='text-sm text-neutral-gray-600 mt-4'>
            Soft skills scores are being generated and will be ready in a few
            minutes
          </p>
        )}
      </Card>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6'>
        {details?.hasFormQuestions && (
          <div>
            <OverallScoreCard />
          </div>
        )}
        <div
          className={cn(
            'grid gap-6',
            !details?.hasFormQuestions && 'col-span-full '
          )}
        >
          <div>
            <CompletedTimeCard />
          </div>
          <div>
            <SoftSkillsCard />
          </div>
        </div>
        <div className='col-span-1 lg:col-span-2'>
          <ServiceDescriptionCard />
        </div>
      </div>
    </div>
  )
}

export default ServiceDetailsTab
