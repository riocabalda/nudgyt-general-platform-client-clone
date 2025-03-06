'use client'

import Metric from '@/app/(shared)/components/Metric'
import { Card } from '@/app/(shared)/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/app/(shared)/components/ui/select'
import { MetricProps } from '@/app/(shared)/types'
import { useState } from 'react'

const DATE_FILTER_VALUE = {
  TODAY: '0',
  YESTERDAY: '2',
  LAST_7_DAYS: '7',
  LAST_30_DAYS: '30',
  THIS_YEAR: '365'
}

const SAMPLE_METRIC_DATA: MetricProps[] = [
  {
    title: 'TOTAL USAGE',
    value: '80:00:00',
    percentageChange: '10%',
    changeDirection: 'increased'
  },
  {
    title: 'AVERAGE USAGE PER SESSION',
    value: '00:30:00',
    percentageChange: '8%',
    changeDirection: 'decreased'
  }
]

function MetricSection() {
  const [filterDateBy] = useState<string>('0')

  return (
    <Card className='flex flex-col gap-10 p-6 w-full xl:w-1/2'>
      <Select value={filterDateBy}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select Filter' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={DATE_FILTER_VALUE.TODAY}>Today</SelectItem>
            <SelectItem value={DATE_FILTER_VALUE.YESTERDAY}>
              Yesterday
            </SelectItem>
            <SelectItem value={DATE_FILTER_VALUE.LAST_7_DAYS}>
              Last 7 days
            </SelectItem>
            <SelectItem value={DATE_FILTER_VALUE.LAST_30_DAYS}>
              Last 30 days
            </SelectItem>
            <SelectItem value={DATE_FILTER_VALUE.THIS_YEAR}>
              This year
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className='grid grid-cols-1 gap-10'>
        {SAMPLE_METRIC_DATA.map((item) => (
          <Metric key={item.title} {...item} />
        ))}
      </div>
    </Card>
  )
}

export default MetricSection
