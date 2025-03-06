'use client'

import { Card } from '@/app/(shared)/components/ui/card'
import { cn, splitSectionName } from '@/app/(shared)/utils'
import { ChevronRight } from 'lucide-react'
import useGetSimulationResults from '../../hooks/useGetSimulationResults'

function SectionCard(props: { sectionIdx: number; withChevron?: boolean }) {
  const { details } = useGetSimulationResults()

  const { sectionIdx, withChevron = false } = props
  const displaySection = details?.displayScores.sections[sectionIdx]

  if (!displaySection) return null

  const [sectionLetter, sectionName] = splitSectionName(displaySection.name)

  return (
    <Card
      className={cn(
        'transition',
        'shadow-sm rounded-none p-4 pb-3 flex items-center gap-4 border lg:border-transparent lg:group-data-[state=active]:bg-neutral-gray-100',
        sectionIdx === 0
          ? 'border-y-neutral-gray-400'
          : 'border-b-neutral-gray-400',
        sectionIdx !== 0 && 'lg:border-t-neutral-gray-200'
      )}
    >
      <header
        className={cn(
          'transition group-data-[state=active]:text-purple-shade-base group-hover:text-purple-shade-base'
        )}
      >
        <p
          className={cn(
            'font-medium text-xs uppercase tracking-[0.03rem]',
            'lg:text-neutral-gray-600 group-data-[state=active]:text-purple-shade-darkest2 group-hover:text-purple-shade-darkest2'
          )}
        >
          Section {sectionLetter}
        </p>
        <p className='font-medium'>{sectionName}</p>
      </header>

      <div className='ml-auto flex items-center gap-2'>
        <p className='text-sm text-neutral-gray-600'>
          {displaySection.showScore ? (
            <span className={cn('font-semibold text-purple-shade-darkest2')}>
              {displaySection.score}%
            </span>
          ) : (
            <span>N/A</span>
          )}
        </p>

        {withChevron && (
          <ChevronRight className='size-6 text-neutral-gray-800' />
        )}
      </div>
    </Card>
  )
}

export default SectionCard
