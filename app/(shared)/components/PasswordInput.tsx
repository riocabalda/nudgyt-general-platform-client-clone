'use client'

import React, { useState } from 'react'
import { Input, InputProps } from './ui/input'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '../utils'

function PasswordInput({
  className,
  eye = false,
  isError,
  inputRef,
  ...otherProps
}: InputProps & { inputRef: any; isError?: boolean; eye?: boolean }) {
  const [inputType, setInputType] = useState<'password' | 'text'>('password')

  const handleEyeClick = () => {
    setInputType((prevState) => {
      return prevState === 'password' ? 'text' : 'password'
    })
  }

  return (
    <div className='relative'>
      <Input
        {...otherProps}
        type={inputType}
        ref={inputRef}
        className={cn('', isError && 'border-destructive', className)}
      />
      {eye && (
        <button
          type='button'
          onClick={handleEyeClick}
          className='absolute text-current -translate-y-1/2 outline-none right-4 top-1/2'
        >
          {inputType === 'text' ? (
            <EyeOff className='h-[16px] w-[16px]' />
          ) : (
            <Eye className='h-[16px] w-[16px]' />
          )}
        </button>
      )}
    </div>
  )
}

export default PasswordInput
