'use client'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/app/(shared)/components/ui/tabs'
import SectionCard from '../cards/SectionCard'
import SectionHeaderCard from '../cards/SectionHeaderCard'
import AnswersBreakdownCard from '../cards/AnswersBreakdownCard'
import useGetSimulationResults from '../../hooks/useGetSimulationResults'

function ScoreSummaryTab() {
  const { details } = useGetSimulationResults()

  const displayScores = details?.displayScores
  if (!displayScores) return null

  const firstDisplaySection = displayScores.sections[0]

  return (
    <Tabs
      orientation='vertical'
      defaultValue={firstDisplaySection?.name}
      className='grid grid-cols-[1fr_2fr] gap-6 overflow-hidden overflow-x-auto'
    >
      <TabsList className='flex-col items-stretch gap-0 p-0 h-auto w-full lg:rounded-[8px] overflow-clip'>
        {displayScores.sections.map(
          (
            displaySection: any, // temporary type any
            idx: number
          ) => (
            <TabsTrigger
              key={idx}
              value={displaySection.name}
              className='p-0 block text-left group'
            >
              <SectionCard sectionIdx={idx} />
            </TabsTrigger>
          )
        )}
      </TabsList>

      {displayScores.sections.map(
        (
          displaySection: any, // temporary type any
          idx: number
        ) => (
          <TabsContent
            key={idx}
            value={displaySection.name}
            className='m-0 row-span-2 row-start-1 col-start-2 grid gap-6 auto-rows-min data-[state=inactive]:hidden'
          >
            <SectionHeaderCard sectionIdx={idx} />

            <AnswersBreakdownCard sectionIdx={idx} />
          </TabsContent>
        )
      )}
    </Tabs>
  )
}

export default ScoreSummaryTab
