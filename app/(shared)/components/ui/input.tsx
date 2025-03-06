import * as React from 'react'

import { cn } from '@/app/(shared)/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<
  HTMLInputElement,
  InputProps & { isError?: boolean }
>(({ className, type, isError, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'h-[48px] w-full rounded-sm border border-input bg-white px-3 py-2 text-sm lg:text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-gray-100 disabled:text-muted-foreground',
        isError && 'border-destructive',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
