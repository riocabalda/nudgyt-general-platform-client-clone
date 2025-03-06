import React, { ComponentProps } from 'react'
import { cn } from '@/app/(shared)/utils'
import { Check } from 'lucide-react'

function StepButton({
  className,
  text,
  stepNum,
  isActive,
  isCompleted,
  ...otherProps
}: ComponentProps<'button'> & {
  text: string
  stepNum: number
  isActive?: boolean
  isCompleted?: boolean
}) {
  return (
    <button
      {...otherProps}
      className={cn(
        'flex gap-[8px] items-center p-[16px] rounded-[8px] cursor-default',
        isActive && 'bg-neutral-gray-200',
        className
      )}
    >
      <span
        className={cn(
          'rounded-full size-[24px] border border-muted-foreground text-muted-foreground flex items-center justify-center',
          isCompleted && 'bg-neutral-gray-600 text-white',
          isActive && 'bg-brandcolora border-brandcolora text-white'
        )}
      >
        {isCompleted ? <Check className='size-[16px]' /> : stepNum}
      </span>
      <span
        className={cn(
          'text-muted-foreground truncate',
          isActive && 'text-brandcolora font-bold'
        )}
      >
        {text}
      </span>
    </button>
  )
}

export default StepButton
