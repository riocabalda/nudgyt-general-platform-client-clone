import React, { PropsWithChildren } from 'react'

function InputError(props: PropsWithChildren) {
  return (
    <span className='text-destructive text-xxs lg:text-xs'>
      {props.children}
    </span>
  )
}

export default InputError
