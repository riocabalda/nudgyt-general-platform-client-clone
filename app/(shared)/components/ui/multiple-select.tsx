import React from 'react'
import Select, { MultiValue, PropsValue, StylesConfig } from 'react-select'

type OptionType = {
  value: string
  label: string
}

type StyledSelectProps = {
  id?: string
  className?: string
  placeholder?: string
  isSearchable?: boolean
  isLoading?: boolean
  onChange: (newValue: MultiValue<OptionType>) => void
  value: PropsValue<OptionType> | null
  options: OptionType[]
  disabled?: boolean
}

const MultipleSelect: React.FC<StyledSelectProps> = ({
  id,
  className,
  placeholder,
  isSearchable = false,
  value,
  options,
  onChange,
  disabled,
  ...props
}) => {
  const customStyles: StylesConfig<OptionType, true> = {
    control: (provided) => ({
      ...provided,
      minHeight: '48px',
      borderRadius: '4px',
      borderColor: 'hsl(var(--input))',
      '&:hover': {
        borderColor: 'hsl(var(--input))'
      },
      boxShadow: 'none'
    }),
    container: (provided) => ({
      ...provided,
      '&:focus-within': {
        outline: 'none'
      },
      zIndex: 10
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'hsl(var(--neutral-gray-500))'
    })
  }

  return (
    <div className='relative'>
      <Select<OptionType, true>
        id={id}
        className={`focus-within:ring-2 focus-within:bg-blue-500 ring-offset-background focus-within:ring-offset-2 ring-brandcolora rounded-sm ${className || ''}`}
        styles={customStyles}
        isMulti
        isSearchable={isSearchable}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        options={options}
        isDisabled={disabled}
        {...props}
      />
    </div>
  )
}

export default MultipleSelect
