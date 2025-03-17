import React from 'react'
import {
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/app/(shared)/components/ui/dialog'
import { Button } from '@/app/(shared)/components/ui/button'
import SaveSimulationBtn from './SaveSimulationBtn'

const StopSimulationSelectAction = ({
  setIsEndingSimulation
}: {
  setIsEndingSimulation: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <DialogContent
      className='rounded-[8px] w-[90%] lg:w-[500px] p-6 gap-6'
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      <DialogHeader>
        <DialogTitle className='text-xl lg:text-2xl font-semibold text-left'>
          Simulation
        </DialogTitle>
      </DialogHeader>

      <div className='flex flex-col items-center justify-end gap-6'>
        <SaveSimulationBtn />
        <Button
          variant='default'
          className='w-full'
          onClick={() => setIsEndingSimulation(true)}
        >
          End Simulation
        </Button>
      </div>
    </DialogContent>
  )
}

export default StopSimulationSelectAction
