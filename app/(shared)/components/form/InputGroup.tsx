import React, { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

function InputGroup(props: ComponentProps<'div'>) {
  return (
    <div className={twMerge('flex flex-col gap-1.5', props.className)}>
      {props.children}
    </div>
  )
}

export default InputGroup
