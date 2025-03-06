import React, { ChangeEvent, useEffect, useState } from 'react'
import moment from 'moment'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select'
import { Input } from './ui/input'

moment.updateLocale('en', {
  week: {
    dow: 1 // Monday is the first day of the week.
  }
})

const presets = [
  {
    label: 'Today',
    value: [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
  },
  {
    label: 'Yesterday',
    value: [
      moment().subtract(1, 'days').format('YYYY-MM-DD'),
      moment().subtract(1, 'days').format('YYYY-MM-DD')
    ]
  },
  {
    label: 'This Week',
    value: [
      moment().startOf('week').format('YYYY-MM-DD'),
      moment().endOf('week').format('YYYY-MM-DD')
    ]
  },
  {
    label: 'Last Week',
    value: [
      moment().startOf('week').subtract(1, 'weeks').format('YYYY-MM-DD'),
      moment().endOf('week').subtract(1, 'weeks').format('YYYY-MM-DD')
    ]
  },
  {
    label: 'This Month',
    value: [
      moment().startOf('month').format('YYYY-MM-DD'),
      moment().endOf('month').format('YYYY-MM-DD')
    ]
  },
  {
    label: 'Last Month',
    value: [
      moment().startOf('month').subtract(1, 'months').format('YYYY-MM-DD'),
      moment().endOf('month').subtract(1, 'months').format('YYYY-MM-DD')
    ]
  },
  {
    label: 'This Year',
    value: [
      moment().startOf('year').format('YYYY-MM-DD'),
      moment().endOf('year').format('YYYY-MM-DD')
    ]
  },
  {
    label: 'Last Year',
    value: [
      moment().startOf('year').subtract(1, 'years').format('YYYY-MM-DD'),
      moment().endOf('year').subtract(1, 'years').format('YYYY-MM-DD')
    ]
  }
]

export default function DateRangePicker({
  className,
  onChange,
  startDate,
  endDate
}: {
  className?: string
  onChange: (startDate: string, endDate: string) => void
  startDate: string
  endDate: string
}) {
  const [preset, setPreset] = useState(presets[0].label)

  const handlePresetChange = (val: string) => {
    setPreset(val)
  }

  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPreset('Custom')
    onChange(e.target.value, endDate)
  }

  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPreset('Custom')
    onChange(startDate, e.target.value)
  }

  useEffect(() => {
    const presetValue = presets.find(
      (presetItem) => presetItem.label === preset
    )?.value
    if (presetValue?.length) {
      onChange(presetValue[0], presetValue[1])
    }
  }, [onChange, preset])

  return (
    <div className={`flex flex-col gap-2 md:flex-row ${className}`}>
      <Select value={preset} onValueChange={handlePresetChange}>
        <SelectTrigger className='min-w-[150px] bg-white focus:ring-0 focus:ring-offset-0'>
          <SelectValue placeholder='Select date' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {presets.map((preset) => (
              <SelectItem key={preset.label} value={preset.label}>
                {preset.label}
              </SelectItem>
            ))}
            <SelectItem value='Custom'>Custom</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className='flex items-center gap-2 overflow-hidden bg-white border rounded-sm shrink-0 lg:h-[50px]'>
        <Input
          type='date'
          value={startDate}
          onChange={handleStartDateChange}
          className='h-full border-none rounded-e-none bg-inherit focus-visible:ring-0 focus-visible:ring-offset-0'
        />
        <span>-</span>
        <Input
          type='date'
          value={endDate}
          onChange={handleEndDateChange}
          className='h-full border-none rounded-s-none bg-inherit focus-visible:ring-0 focus-visible:ring-offset-0'
        />
      </div>
    </div>
  )
}
