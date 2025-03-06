import { ComponentProps, ReactNode } from 'react'
import { cn } from '../utils'
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip'

function StyledTooltip(props: {
  trigger: ReactNode
  content: ReactNode
  withArrow?: boolean
  contentSide?: ComponentProps<typeof TooltipContent>['side']
}) {
  const { trigger, content } = props
  const { withArrow = true } = props
  const { contentSide = 'bottom' } = props

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>

        <TooltipContent
          side={contentSide}
          /**
           * Keep tooltip open on trigger click
           *
           * https://github.com/radix-ui/primitives/issues/2029
           */
          onPointerDownOutside={(event) => event.preventDefault()}
          className={cn(
            /**
             * Allow tooltip arrow to be displayed
             *
             * https://github.com/shadcn-ui/ui/issues/2753
             */
            'overflow-visible',
            'border-none',
            'max-w-40 rounded-sm p-3 bg-neutral-gray-800',
            'text-center text-white text-xs tracking-[0.02rem]'
          )}
        >
          {withArrow && (
            <TooltipArrow
              height={12}
              width={16}
              className='text-neutral-gray-800'
            />
          )}

          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default StyledTooltip
