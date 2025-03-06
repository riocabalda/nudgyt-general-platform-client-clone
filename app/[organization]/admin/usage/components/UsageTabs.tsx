'use client'
import { useEffect, useRef, useState } from 'react'
import LearnersTab from './tabs/LearnersTab'
import ServicesTab from './tabs/ServicesTab'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/app/(shared)/components/ui/tabs'
import { cn } from '@/app/(shared)/utils'
import Search from '@/app/(shared)/components/Search'

function UsageTabs() {
  const tabsData = [
    {
      name: 'Learners',
      value: 'learners',
      content: (
        <div className='p-4 pb-10 lg:p-10'>
          <LearnersTab
            actionItems={[
              <Search
                key='learners-search'
                containerClass='lg:w-full xl:w-[344px]'
              />
            ]}
          />
        </div>
      )
    },
    {
      name: 'Services',
      value: 'services',
      content: (
        <div className='p-4 pb-10 lg:p-10'>
          <ServicesTab
            actionItems={[
              <Search
                key='services-search'
                containerClass='lg:w-full xl:w-[344px]'
              />
            ]}
          />
        </div>
      )
    }
  ]

  const [value, setValue] = useState<string | undefined>(undefined)
  const triggerListRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    function selectFirstVisibleTabTrigger() {
      const triggerList = triggerListRef.current
      if (triggerList === null) return

      const triggerIdxArr = Array.from(
        triggerList.children,
        (trigger, idx) => ({
          trigger,
          idx
        })
      )
      for (const { trigger, idx } of triggerIdxArr) {
        const compStyles = getComputedStyle(trigger)
        const isVisible = compStyles.getPropertyValue('display') !== 'none'
        if (!isVisible) continue

        const newValue = tabsData[idx].value
        setValue(newValue)
        break
      }
    }

    selectFirstVisibleTabTrigger()
  }, [])

  return (
    <Tabs
      value={value}
      onValueChange={setValue}
      className='w-full min-h-[50vh]'
    >
      <TabsList
        ref={triggerListRef}
        className={cn(
          'justify-start', // Override justify-center of component
          'w-full overflow-x-auto h-14 border-b border-neutral-gray-400 rounded-none p-0 lg:px-10 bg-transparent'
        )}
      >
        {tabsData.map(({ value, name }) => (
          <TabsTrigger
            key={value}
            value={value}
            className={cn(
              'relative h-full rounded-none font-normal text-base text-neutral-gray-400 border-b-[3px] border-transparent data-[state=active]:shadow-none lg:px-6',
              'data-[state=active]:border-brandcolora data-[state=active]:text-brandcolora hover:text-brandcolora',
              'grid *:row-[1] *:col-[1]',
              'group'
            )}
          >
            <span className='opacity-0 group-data-[state=active]:opacity-100 font-semibold'>
              {name}
            </span>
            <span
              aria-hidden
              className='opacity-100 group-data-[state=active]:opacity-0'
            >
              {name}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabsData.map(({ value, content }) => (
        <TabsContent key={value} value={value} className='m-0'>
          {content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default UsageTabs
