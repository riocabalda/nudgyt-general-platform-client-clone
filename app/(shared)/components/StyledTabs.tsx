'use client'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/app/(shared)/components/ui/tabs'
import { cn } from '@/app/(shared)/utils'
import { ComponentProps, PropsWithChildren, ReactElement } from 'react'

function ExtendedWidthLine() {
  return (
    <div className='relative w-[100vw] left-[50%] right-[50%] -mx-[50vw]'>
      <div className='absolute pb-[2px] w-full border-b border-neutral-gray-400 -translate-y-0.5 z-0' />
    </div>
  )
}

export function StyledTabs(
  props: ComponentProps<typeof Tabs> & {
    children?: ReactElement<ComponentProps<typeof StyledTabItem>>[]
  }
) {
  const { className, children = [], ...tabsProps } = props

  if (children.length === 0) {
    return null
  }

  return (
    <Tabs
      {...tabsProps}
      className={cn(
        'w-full min-h-[50vh]',
        'lg:container !px-0 lg:!px-10',
        className
      )}
    >
      <TabsList
        className={cn(
          'justify-start',
          'w-full overflow-x-auto h-14 overflow-y-hidden rounded-none p-0 bg-transparent'
        )}
      >
        {children.map((child) => (
          <TabsTrigger
            key={child.props.value}
            value={child.props.value}
            className={cn(
              'relative h-full rounded-none font-normal text-base text-neutral-gray-400 z-10 border-b-[3px] border-transparent data-[state=active]:shadow-none lg:px-6',
              'data-[state=active]:border-brandcolora data-[state=active]:text-brandcolora hover:text-brandcolora',
              'grid *:row-[1] *:col-[1]',
              'group'
            )}
          >
            <span className='opacity-0 group-data-[state=active]:opacity-100 font-semibold'>
              {child.props.name}
            </span>
            <span
              aria-hidden
              className='opacity-100 group-data-[state=active]:opacity-0'
            >
              {child.props.name}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      <ExtendedWidthLine />

      {children}
    </Tabs>
  )
}

export function StyledTabItem(
  props: PropsWithChildren<{
    name: string
    value: string
    className?: string
  }>
) {
  const { value } = props
  const { children, className } = props

  return (
    <TabsContent
      key={value}
      value={value}
      className={cn('m-0 lg:pt-8', className)}
    >
      {children}
    </TabsContent>
  )
}
