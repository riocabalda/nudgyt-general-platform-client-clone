'use client'

import { Card } from '@/app/(shared)/components/ui/card'
import { ComponentProps, useState } from 'react'
import SoftSkillsChart from './soft-skills/SoftSkillsChart'
import SkillCardCollapsible from './soft-skills/SkillCardCollapsible'
import useGetSimulationResults from '../../hooks/useGetSimulationResults'
function ChartCard() {
  const { softSkills } = useGetSimulationResults()

  const ratings = softSkills?.data?.ratings ?? []

  const chartData: ComponentProps<typeof SoftSkillsChart>['data'] = ratings.map(
    ({ skill, score, total }: any) => ({
      // temporary type any
      label: skill,
      value: score,
      total
    })
  )

  return (
    <Card className='shadow-sm rounded-[8px]'>
      <div className='w-full h-96'>
        <SoftSkillsChart data={chartData} size='md' withLabels />
      </div>
    </Card>
  )
}

/** Show only one collapsible at a time */
function CollapsiblesGroup() {
  const { softSkills } = useGetSimulationResults()
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

  const ratings = softSkills?.data?.ratings ?? []

  function toggleSelectedIdx(idx: number) {
    setSelectedIdx((selectedIdx) => (selectedIdx === idx ? null : idx))
  }

  return (
    <div className='grid gap-4 lg:gap-6'>
      {ratings.map(
        (
          rating: any, // temporary type any
          idx: number
        ) => (
          <SkillCardCollapsible
            key={idx}
            rating={rating}
            open={selectedIdx === idx}
            onOpenChange={() => toggleSelectedIdx(idx)}
          />
        )
      )}
    </div>
  )
}

function SoftSkillsTab() {
  const { softSkills } = useGetSimulationResults()

  const softSkillsData = softSkills?.data

  const hasSoftSkillsData =
    softSkillsData !== null &&
    Array.isArray(softSkillsData?.ratings) &&
    softSkillsData.ratings.length > 0

  if (!hasSoftSkillsData) {
    return (
      <article className='max-w-[712px] mx-auto px-4 lg:px-6'>
        <p className='text-center text-neutral-gray-600'>
          Soft skills scores are being generated and will be ready in a few
          minutes.
        </p>
      </article>
    )
  }

  return (
    <article className='max-w-[560px] mx-auto grid gap-6'>
      <ChartCard />

      <CollapsiblesGroup />
    </article>
  )
}

export default SoftSkillsTab
