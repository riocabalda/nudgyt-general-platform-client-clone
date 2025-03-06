'use client'

import { Card } from '@/app/(shared)/components/ui/card'
import { cn, splitSectionName } from '@/app/(shared)/utils'
import useGetSimulationResults from '../../hooks/useGetSimulationResults'

function SectionHeaderCard(props: { sectionIdx: number }) {
  const { details } = useGetSimulationResults()

  const { sectionIdx } = props

  const displaySection = details?.displayScores.sections[sectionIdx]

  if (!displaySection) return null

  const [sectionLetter, sectionName] = splitSectionName(displaySection.name)

  return (
    <Card className='shadow-sm rounded-none lg:rounded-[8px] p-4 lg:p-6 flex justify-between gap-4 lg:gap-6 items-center'>
      <div>
        <p className='font-medium text-xs uppercase tracking-[0.03rem] text-neutral-gray-600'>
          Section {sectionLetter}
        </p>
        <h2 className='font-medium lg:font-semibold lg:text-xl'>
          {sectionName}
        </h2>
      </div>

      <p className='text-2xl lg:text-4xl text-neutral-gray-600'>
        {displaySection.showScore ? (
          <span className={cn('font-semibold text-purple-shade-darkest2')}>
            {displaySection.score}%
          </span>
        ) : (
          <span>N/A</span>
        )}
      </p>
    </Card>
  )
}

export default SectionHeaderCard
