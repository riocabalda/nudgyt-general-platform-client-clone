import React, { useEffect } from 'react'
import { cn } from '@/app/(shared)/utils'
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams
} from 'next/navigation'
import { TabsFormQuestions } from './TabsFormQuestions'
import TabsRubrics from './TabsRubrics'
import TabsLearner from './TabsLearner'
import useGetParamsFromURL from '@/app/(shared)/hooks/useGetParamsFromURL'
import LevelButtons from '@/app/(shared)/components/admin-trainer-shared/services/multi-level/LevelButtons'
import useGetService from '../hooks/useGetService'
import useOrganization from '@/app/(shared)/hooks/useOrganization'

function Tabs({ isMultiLevelService }: { isMultiLevelService?: boolean }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { serviceId } = useParams()
  const { orgSlug } = useOrganization()

  const { isURLTampered } = useGetParamsFromURL({
    tab: ['learners', 'form-answers', 'rubrics'],
    // Only include level validation if isMultiLevelService is true
    // Refactor to dynamic level value
    ...(isMultiLevelService && { level: ['1', '2', '3'] })
  })

  const { serviceData } = useGetService(orgSlug, String(serviceId))

  useEffect(() => {
    const hasTabKey = searchParams.has('tab')

    if (isURLTampered || !hasTabKey)
      router.replace(
        `${pathname}?tab=learners${isMultiLevelService ? '&level=1' : ''}`
      )
  }, [isURLTampered])

  const handleTabClick = (tab: string) => {
    router.push(
      `${pathname}?tab=${tab}${isMultiLevelService ? '&level=1' : ''}`,
      { scroll: false }
    )
  }

  const tab = searchParams.get('tab') || 'learners'

  return (
    <div className='container px-0'>
      <div className='border-b flex truncate lg:px-[40px] overflow-x-auto'>
        <button
          className={cn(
            'border-b-[3px] border-transparent px-[24px] py-[14px] text-neutral-gray-500',
            tab === 'learners' &&
              `border-brandcolorf text-brandcolorf font-semibold`
          )}
          onClick={() => handleTabClick('learners')}
        >
          Learners
        </button>

        {serviceData &&
          serviceData?.basic_level?.form_questions?.length > 0 && (
            <button
              className={cn(
                'border-b-[3px] border-transparent px-[24px] py-[14px] text-neutral-gray-500',

                tab === 'form-answers' &&
                  `border-brandcolorf text-brandcolorf font-semibold`
              )}
              onClick={() => handleTabClick('form-answers')}
            >
              Form Answers
            </button>
          )}

        {serviceData && serviceData?.basic_level?.rubrics && (
          <button
            className={cn(
              'border-b-[3px] border-transparent px-[24px] py-[14px] text-neutral-gray-500',
              tab === 'rubrics' &&
                `border-brandcolorf text-brandcolorf font-semibold`
            )}
            onClick={() => handleTabClick('rubrics')}
          >
            Rubrics
          </button>
        )}
      </div>
      <div
        className={cn(
          'flex py-6 lg:py-[40px] px-4 lg:px-10',
          isMultiLevelService && 'flex-col lg:flex-row'
        )}
      >
        {isMultiLevelService && <LevelButtons />}
        <div className='flex-1 overflow-x-auto'>
          {tab === 'learners' && (
            <TabsLearner isMultiLevelService={isMultiLevelService ?? false} />
          )}
          {tab === 'form-answers' && <TabsFormQuestions />}
          {tab === 'rubrics' && <TabsRubrics />}
        </div>
      </div>
    </div>
  )
}

export default Tabs
