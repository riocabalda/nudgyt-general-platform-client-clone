'use client'

import React, { useState } from 'react'
import { Button } from '@/app/(shared)/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/(shared)/components/ui/dialog'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Card } from '@/app/(shared)/components/ui/card'
import { ArrowUpNarrowWide, Play } from 'lucide-react'
import SimulationStartDateSelect from './SimulationStartDateSelect'

const startingPoints = [
  {
    date: 'May 20, 2024, 9:45 AM',
    score: '80',
    completed_time: '01:25:48',
    summary: 'Lorem ipsum dolor sit amet, consectetur elit semper magna.'
  },
  {
    date: 'May 21, 2024, 10:15 AM',
    score: '82',
    completed_time: '01:25:48',
    summary: 'Nullam vestibulum sapien nec ante ornare hendrerit vitae sed.'
  },
  {
    date: 'May 22, 2024, 2:30 PM',
    score: '89',
    completed_time: '01:25:48',
    summary: 'Maecenas pulvinar dui nec tortor volutpat, felis metus consequat.'
  }
]

function NextLevelModal({ nextLevelData }: { nextLevelData: any }) {
  const [open, setOpen] = useState(false)

  const [selectedStartingPoint, setSelectedStartingPoint] = useState({
    date: 'May 20, 2024, 9:45 AM',
    score: '80',
    completed_time: '01:25:48',
    summary: 'Lorem ipsum dolor sit amet, consectetur elit semper magna.'
  })

  const handleDateChange = (date: string) => {
    const newStartingPoint = startingPoints.find((data) => data.date === date)
    setSelectedStartingPoint(newStartingPoint as any)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={true} className='flex items-center gap-[10px]'>
          <Play size={20} />
          <span>Start Level {nextLevelData.level}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='!rounded-[8px] lg:p-6 w-full max-w-[90%] lg:max-w-[600px] gap-0'>
        <DialogHeader>
          <DialogTitle className='text-left text-[20px] font-semibold lg:text-2xl text-foreground'>
            Choose starting point
          </DialogTitle>
          <DialogDescription className='text-left lg:text-base text-neutral-gray-600 !mt-6'>
            Your progress in this next level will be shaped by the interactions
            from the attempt you select here. Select an attempt to build upon
            for the next level.
          </DialogDescription>
        </DialogHeader>
        <Card className='flex flex-col gap-6 p-6 border border-neutral-gray-400 mt-6'>
          <div className='flex items-center gap-2 text-neutral-gray-800'>
            <ArrowUpNarrowWide size={20} />
            <h3 className='text-sm font-medium'>Level {nextLevelData.level}</h3>
          </div>
          <SimulationStartDateSelect
            selectedStartingPoint={selectedStartingPoint}
            startingPoints={startingPoints}
            handleDateChange={handleDateChange}
          />
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xs font-medium text-neutral-gray-800 capitalize'>
                Overall score
              </h3>
              <span className='text-sm text-neutral-gray-600'>
                {selectedStartingPoint.score} %
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <h3 className='text-xs font-medium text-neutral-gray-800 capitalize'>
                Completed time
              </h3>
              <span className='text-sm text-neutral-gray-600'>
                {selectedStartingPoint.completed_time}
              </span>
            </div>
            <div className='flex flex-col gap-4'>
              <h3 className='text-xs font-medium text-neutral-gray-800 capitalize'>
                Transcript summary
              </h3>
              <p className='text-sm text-neutral-gray-600'>
                {selectedStartingPoint.summary}
              </p>
            </div>
          </div>
        </Card>
        <div className='flex justify-end mt-6'>
          <Button className='flex items-center gap-[10px]'>
            <Play size={20} />
            <span>Start Level {nextLevelData.level}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NextLevelModal
