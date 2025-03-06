'use client'

import React, { ChangeEvent } from 'react'

function PersonalityPicker({
  personality,
  startLabel,
  endLabel,
  value,
  onChange,
  disabled
}: {
  personality: string
  startLabel: string
  endLabel: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
}) {
  const name = personality.replace(/ /g, '_').toLocaleLowerCase()

  const handleChange = (value: string) => {
    if (onChange) onChange(value)
  }

  function Value({
    name,
    value,
    checked,
    onChange,
    disabled
  }: {
    name: string
    value: string
    checked?: boolean
    onChange?: (value: string) => void
    disabled?: boolean
  }) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e.target.value)
    }
    return (
      <label className='flex flex-col items-center gap-[12px]'>
        <input
          type='radio'
          name={name}
          value={value}
          className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} hidden peer`}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
        />
        <div className='relative peer-checked:[&>div]:block'>
          <div className='h-[9px] w-[1px] bg-neutral-gray-400' />

          <div className='hidden size-[11px] rounded-full bg-brandcolorf absolute top-0 left-0 -translate-x-1/2' />
        </div>
        <span
          className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} text-xs text-muted-foreground`}
        >
          {value}
        </span>
      </label>
    )
  }

  return (
    <div>
      <p className='text-sm font-semibold capitalize'>{personality}</p>
      <div className='relative flex items-center justify-between mt-[8px]'>
        <div className='w-full h-[1px] bg-neutral-gray-400 absolute top-[4px]' />
        <Value
          name={name}
          value='0'
          checked={value === '0'}
          onChange={handleChange}
          disabled={disabled}
        />
        <Value
          name={name}
          value='1'
          checked={value === '1'}
          onChange={handleChange}
          disabled={disabled}
        />
        <Value
          name={name}
          value='2'
          checked={value === '2'}
          onChange={handleChange}
          disabled={disabled}
        />
        <Value
          name={name}
          value='3'
          checked={value === '3'}
          onChange={handleChange}
          disabled={disabled}
        />
        <Value
          name={name}
          value='4'
          checked={value === '4'}
          onChange={handleChange}
          disabled={disabled}
        />
        <Value
          name={name}
          value='5'
          checked={value === '5'}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
      <div className='flex items-start justify-between w-full text-xs text-muted-foreground mt-[12px]'>
        <p className='leading-none'>{startLabel}</p>
        <p className='leading-none'>{endLabel}</p>
      </div>
    </div>
  )
}

export default PersonalityPicker
