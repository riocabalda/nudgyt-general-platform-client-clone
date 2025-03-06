'use client'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/app/(shared)/components/ui/tabs'
import { cn } from '@/app/(shared)/utils'
import { ComponentProps, ReactNode } from 'react'

type TabData = {
  value: string
  name: string
  content: ReactNode
}

function InfoTabs(props: {
  tabs: TabData[]
  value?: ComponentProps<typeof Tabs>['value']
  onValueChange?: ComponentProps<typeof Tabs>['onValueChange']
}) {
  const { tabs, value, onValueChange } = props

  return (
    <Tabs
      defaultValue={tabs[0].value}
      value={value}
      onValueChange={onValueChange}
      className='w-full min-h-[50vh]'
    >
      <TabsList
        className={cn(
          'justify-start', // Override justify-center of component
          'w-full overflow-x-auto h-14 border-b border-neutral-gray-400 rounded-none p-0 lg:px-10  bg-transparent'
        )}
      >
        {tabs.map(({ value, name }) => (
          <TabsTrigger
            key={value}
            value={value}
            className={cn(
              'relative h-full rounded-none font-normal text-base text-neutral-gray-400 border-b-[3px] border-transparent data-[state=active]:shadow-none lg:px-6',
              'group grid *:row-[1] *:col-[1] data-[state=active]:border-purple-shade-darkest2 data-[state=active]:text-purple-shade-darkest2 hover:text-purple-shade-darkest2'
            )}
          >
            <span className='opacity-0 group-data-[state=active]:opacity-100 font-semibold'>
              {name}
            </span>
            <span className='opacity-100 group-data-[state=active]:opacity-0'>
              {name}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(({ value, content }) => (
        <TabsContent key={value} value={value} className='m-0'>
          {content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export default InfoTabs
