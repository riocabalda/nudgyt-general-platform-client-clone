import React from 'react'
import { cn } from '@/app/(shared)/utils'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { TabRubrics } from './TabRubrics'
import { TabFormAnswers } from './TabFormAnswers'

type TabsProps = {
  isFormAnswersVisible: boolean
  isRubricsVisible: boolean
}

function Tabs({ isFormAnswersVisible, isRubricsVisible }: TabsProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const handleTabClick = (tab: string) => {
    router.replace(`${pathname}?tab=${tab}`)
  }

  const defaultTab = isFormAnswersVisible ? 'form-answers' : 'rubrics'

  if (!isFormAnswersVisible && !isRubricsVisible) {
    return null
  }

  const tab = searchParams.get('tab') || defaultTab

  return (
    <div className='container px-0'>
      <div className='border-b flex flex-wrap lg:px-[40px]'>
        {isFormAnswersVisible && (
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
        {isRubricsVisible && (
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
      <div className='flex py-6 lg:py-[40px] px-4 lg:px-10'>
        <div className='flex-1 overflow-x-auto'>
          {tab === 'form-answers' && <TabFormAnswers />}
          {tab === 'rubrics' && <TabRubrics />}
        </div>
      </div>
    </div>
  )
}

export default Tabs
