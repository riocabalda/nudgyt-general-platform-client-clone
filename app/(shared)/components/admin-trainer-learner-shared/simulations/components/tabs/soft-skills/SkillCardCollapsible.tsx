'use client'

import { Card } from '@/app/(shared)/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/app/(shared)/components/ui/collapsible'
import { SoftSkillRating } from '@/app/(shared)/types'
import { cn, hasStringData } from '@/app/(shared)/utils'
import { ChevronDown } from 'lucide-react'
import { ComponentProps } from 'react'

function SkillCardCollapsible(props: {
  rating: SoftSkillRating
  open: ComponentProps<typeof Collapsible>['open']
  onOpenChange: ComponentProps<typeof Collapsible>['onOpenChange']
}) {
  const { rating, open, onOpenChange } = props

  const hasDescription = hasStringData(rating.description)
  const hasImportance = hasStringData(rating.importance)
  const hasAssessment = rating.assessment.length > 0
  const hasContent = hasDescription || hasImportance || hasAssessment

  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className='group'>
      <Card className='shadow-sm rounded-[8px]'>
        <CollapsibleTrigger disabled={!hasContent} className='w-full'>
          <header className='flex items-center justify-between gap-4 p-4 lg:p-6'>
            <h4 className='font-semibold lg:text-xl'>{rating.skill}</h4>

            <div className='flex items-center gap-4'>
              <span
                className={cn(
                  'font-semibold lg:text-xl text-purple-shade-darkest2 hover:text-purple-shade-darkest2'
                )}
              >
                {rating.score}
              </span>

              {hasContent && (
                <ChevronDown className='size-5 transition group-data-[state=open]:rotate-180' />
              )}
            </div>
          </header>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className='grid gap-6 p-4 lg:p-6 pt-0 lg:pt-0'>
            {hasDescription && <p>{rating.description}</p>}

            {hasDescription && <hr className='border-neutral-gray-500' />}

            {hasImportance && (
              <section className='grid gap-2'>
                <h5 className='font-semibold text-sm'>Importance</h5>

                <p className='text-neutral-gray-600'>{rating.importance}</p>
              </section>
            )}

            {hasAssessment && (
              <section className='grid gap-2 p-4 rounded-[8px] bg-neutral-gray-50'>
                <h5 className='font-semibold text-sm'>Assessment Rubrics</h5>

                <ul className='list-disc ml-5'>
                  {rating.assessment.map(
                    (
                      item: any,
                      idx: number // temporary type any
                    ) => (
                      <li
                        key={idx}
                        className='text-neutral-gray-600 text-sm lg:text-base'
                      >
                        <p>{item}</p>
                      </li>
                    )
                  )}
                </ul>
              </section>
            )}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

export default SkillCardCollapsible
