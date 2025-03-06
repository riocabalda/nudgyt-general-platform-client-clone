import React from 'react'
import { cn } from '../../utils'

function TemplateMasterBadge() {
  return (
    <p
      className={cn(
        'p-[6px] text-[10px] lg:text-xs rounded-[4px] uppercase font-medium w-max tracking-[.48px] absolute z-[1] right-4 top-4 bg-white text-black'
      )}
    >
      Master
    </p>
  )
}

export default TemplateMasterBadge
