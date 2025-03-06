import React, { useEffect, useRef, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/app/(shared)/components/ui/select'
import { Input } from '@/app/(shared)/components/ui/input'
import { cn } from '@/app/(shared)/utils'
import { TransformedQuestion } from '../../types/simulationFormTypes'

function containsOther(description: string) {
  // Convert input to lowercase to ensure case-insensitive check
  const lowerCaseInput = description.toLowerCase()

  // Check if the string contains the word 'other'
  return lowerCaseInput.includes('other')
}

function CustomSelect({
  question,
  value,
  index,
  onChange,
  handleQuestionDependency,
  handleDependentFromDateInput,
  handleSetProgress
}: {
  question: TransformedQuestion
  value: string
  index: number
  onChange: (value: string) => void
  handleQuestionDependency?: (questionNo: string, value: string) => void
  handleSetProgress?: () => void
  handleDependentFromDateInput: (
    questionType: string,
    val: string,
    index: number
  ) => void
}) {
  const [otherOptionText, setOtherOptionText] = useState('')
  const [otherOption, setOtherOption] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)

  const valueChange = question.options.some((e) => e.option === value)
    ? value
    : otherOption

  useEffect(() => {
    // Set selected to option "Other" if value is not in the options
    if (!question.options.some((opt) => opt.option === value) && value) {
      const otherIndex = question.options.length - 1
      setOtherOption(question.options[otherIndex].option)
      setOtherOptionText(value)
    }
  }, [])

  const handleBlur = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }
  const handleOnValueChange = (val: string) => {
    if (question.options.some((e) => e.option === val)) {
      setOtherOptionText('')
      onChange(val)
      if (handleQuestionDependency)
        handleQuestionDependency(question.question_no, val)
      if (handleSetProgress) handleSetProgress()
      if (handleDependentFromDateInput)
        handleDependentFromDateInput(question.question_type, val, index)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    option: string
  ) => {
    const newVal = e.target.value
    setOtherOptionText(newVal)
    if (newVal) {
      setOtherOption(option)
      onChange(newVal)
    } else {
      setOtherOption('')
    }
  }

  return (
    <Select value={valueChange} onValueChange={handleOnValueChange}>
      <SelectTrigger className='w-full text-sm text-left'>
        <SelectValue
          className='text-sm placeholder:!text-xs'
          placeholder='Select answer'
        />
      </SelectTrigger>
      <SelectContent className='absolute w-auto min-w-full max-h-40 lg:max-h-fit overflow-y-auto'>
        <SelectGroup>
          {question.options?.map((item, index) => (
            <SelectGroup key={index}>
              <SelectItem
                className={cn(
                  'px-3 py-2 cursor-pointer whitespace-normal break-words',
                  containsOther(item.option_description) && 'hidden'
                )}
                value={String(item.option)}
              >
                {`${item.option} - ${item.option_description} `}
              </SelectItem>
              <SelectLabel
                className={cn(
                  'hidden w-full px-3 py-2  hover:bg-slate-100',
                  containsOther(item.option_description) && 'block'
                )}
              >
                <label
                  className='ml-[2px] font-normal whitespace-normal break-words'
                  htmlFor='others'
                >
                  {`${item.option} - ${item.option_description} `}
                </label>
                <div className='flex items-center gap-2'>
                  <Input
                    id='others'
                    ref={inputRef}
                    className='!text-sm mt-2 font-normal flex-1 h-fit p-3 lg:text-base w-full rounded-sm focus:!ring-transparent'
                    placeholder='Enter your answer...'
                    value={otherOptionText}
                    onBlur={handleBlur}
                    onChange={(e) => handleInputChange(e, item.option)}
                  />
                </div>
              </SelectLabel>
            </SelectGroup>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default CustomSelect
