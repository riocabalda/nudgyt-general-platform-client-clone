'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/app/(shared)/components/ui/collapsible'
import { cn } from '@/app/(shared)/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import useGetSimulationResults from '../../hooks/useGetSimulationResults'

function ScoreBreakdownList() {
  const { details } = useGetSimulationResults()

  const displaySections = details?.displayScores.sections ?? []

  return (
    <ol className='grid gap-2'>
      {displaySections.map((section: any, idx: number) => (
        <li
          key={idx}
          className='flex justify-between text-sm text-neutral-gray-600'
        >
          <span>{section.name}</span>

          {section.showScore ? (
            <span className={cn('font-semibold text-purple-shade-darkest2')}>
              {section.score}/{section.total}
            </span>
          ) : (
            <span>N/A</span>
          )}
        </li>
      ))}
    </ol>
  )
}

function BreakdownCollapsible() {
  // const { results } = useGetSimulationResults()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className='grid'>
      <CollapsibleContent className='overflow-hidden data-[state=open]:animate-[collapsible-open_500ms_ease-in-out] data-[state=closed]:animate-[collapsible-close_500ms_ease-in-out]'>
        <div className='mb-4'>
          <ScoreBreakdownList />
        </div>
      </CollapsibleContent>

      <CollapsibleTrigger asChild className='w-full'>
        <Button
          variant='ghost'
          className={cn(
            'text-base h-auto flex justify-center items-center gap-6 text-purple-shade-darkest2 hover:text-purple-shade-darkest2'
          )}
        >
          {isOpen ? (
            <>
              <span className='font-medium'>Hide Breakdown</span>
              <ChevronUp className='size-5' />
            </>
          ) : (
            <>
              <span className='font-medium'>Show Breakdown</span>
              <ChevronDown className='size-5' />
            </>
          )}
        </Button>
      </CollapsibleTrigger>
    </Collapsible>
  )
}

function Competency() {
  const { details } = useGetSimulationResults()

  const isCompetent = details?.isCompetent ?? false

  return (
    <p className={cn('text-sm font-semibold text-purple-shade-darkest2')}>
      {isCompetent ? <>Competent</> : <>Needs Practice</>}
    </p>
  )
}

function ScoreHeader() {
  const { details } = useGetSimulationResults()

  return (
    <header className='grid gap-1'>
      <div className='flex justify-between gap-4 items-center'>
        <h3 className='text-lg font-semibold'>Overall Score</h3>
        <p className='text-2xl font-semibold text-purple-shade-darkest2'>
          {details?.displayScores.overall.score}/
          {details?.displayScores.overall.total}
        </p>
      </div>

      <div className='hidden lg:flex justify-between gap-4 items-baseline'>
        <p className='text-sm text-neutral-gray-800'>
          <>{details?.displayScores.overall.percentage}%</>
        </p>
        <Competency />
      </div>
    </header>
  )
}

function OverallScoreCard(props: { isCollapsible?: boolean }) {
  const { isCollapsible = false } = props

  return (
    <Card className='shadow-sm rounded-[8px] p-4 lg:p-6'>
      <ScoreHeader />

      <hr className='border-neutral-gray-400 my-4' />

      {isCollapsible ? <BreakdownCollapsible /> : <ScoreBreakdownList />}
    </Card>
  )
}

export default OverallScoreCard
