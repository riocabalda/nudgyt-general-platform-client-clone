import React from 'react'
import { cn } from '../../utils'

function ServiceStatusBadge({
  className,
  variant
}: {
  className?: string
  variant: 'published' | 'draft' | 'saved'
}) {
  return (
    <p
      className={cn(
        'p-[6px] text-[10px] lg:text-xs text-white rounded-[4px] uppercase font-medium w-max tracking-[.48px]',
        variant === 'published' && 'bg-success',
        variant === 'draft' && 'bg-neutral-gray-600',
        variant === 'saved' && 'bg-white border-neutral-500 text-neutral-600',
        className
      )}
    >
      {variant}
    </p>
  )
}

export default ServiceStatusBadge
