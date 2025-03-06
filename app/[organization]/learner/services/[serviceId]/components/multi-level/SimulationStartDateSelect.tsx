import React from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/app/(shared)/components/ui/select'

function SimulationStartDateSelect({
  selectedStartingPoint,
  startingPoints,
  handleDateChange
}: {
  selectedStartingPoint: any
  startingPoints: any
  handleDateChange: (date: string) => void
}) {
  return (
    <Select value={selectedStartingPoint.date} onValueChange={handleDateChange}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder='Select a start date' />
      </SelectTrigger>
      <SelectContent>
        {startingPoints.map((data: any) => (
          <SelectItem key={data.date} value={data.date}>
            {data.date}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SimulationStartDateSelect
