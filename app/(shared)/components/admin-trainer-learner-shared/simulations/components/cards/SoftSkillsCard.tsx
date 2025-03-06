'use client'
import { Card } from '@/app/(shared)/components/ui/card'
import { hasStringData } from '@/app/(shared)/utils'
import { ComponentProps } from 'react'
import SoftSkillsChart from '../tabs/soft-skills/SoftSkillsChart'
import { Button } from '@/app/(shared)/components/ui/button'
import useGetSimulationResults from '../../hooks/useGetSimulationResults'

function SoftSkillsCardContent() {
  const { softSkills } = useGetSimulationResults()
  const softSkillsData = softSkills?.data
  const hasSoftSkillsData =
    softSkillsData !== null &&
    Array.isArray(softSkillsData?.ratings) &&
    softSkillsData.ratings.length > 0

  if (!hasSoftSkillsData) {
    return (
      <p className='text-neutral-gray-600 text-sm'>
        Soft skills scores are being generated and will be ready in a few
        minutes.
      </p>
    )
  }

  const chartData: ComponentProps<typeof SoftSkillsChart>['data'] =
    softSkillsData?.ratings.map(({ skill, score, total }: any) => ({
      label: skill,
      value: score,
      total
    }))

  const summary = softSkillsData?.summary
  const hasSummary = hasStringData(summary)

  return (
    <>
      <div className='w-full h-44'>
        <SoftSkillsChart data={chartData} size='md' withLabels />
      </div>

      {hasSummary && (
        <p className='text-sm leading-[21.7px] text-neutral-gray-600'>
          {summary}
        </p>
      )}
    </>
  )
}

function SoftSkillsCard() {
  return (
    <Card className='shadow-sm rounded-[8px] p-4 lg:p-6 grid gap-4'>
      <header className='grid gap-3'>
        <h3 className='text-lg font-semibold'>Soft Skills</h3>
      </header>

      <SoftSkillsCardContent />
      <Button size='sm' variant='outline' className='w-full'>
        Learn more
      </Button>
    </Card>
  )
}

export default SoftSkillsCard
