import { PropsWithChildren } from 'react'
import { ScrollArea, ScrollBar } from '../components/ui/scroll-area'
import { cn } from '../utils'

function TableScrollArea(props: PropsWithChildren) {
  const { children } = props

  return (
    <ScrollArea
      className={cn(
        '[&_[data-radix-scroll-area-viewport]]:max-h-[600px] [&_[data-radix-scroll-area-viewport]]:flex',
        'group'
      )}
      scrollbar={
        <>
          <ScrollBar
            orientation='vertical'
            className='transition opacity-0 group-hover:opacity-100'
          />
          <ScrollBar
            orientation='horizontal'
            className='transition opacity-0 group-hover:opacity-100'
          />
        </>
      }
    >
      {children}
    </ScrollArea>
  )
}

export default TableScrollArea
