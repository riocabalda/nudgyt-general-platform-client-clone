import React from 'react'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/app/(shared)/components/ui/dialog'
import { Button } from '@/app/(shared)/components/ui/button'
import EndSimulationBtn from './EndSimulationBtn'

function StopSimulationContent({
  isSubmitting,
  open,
  setOpen,
  setIsSubmitting
}: {
  isSubmitting: boolean
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <DialogContent className='rounded-[8px] w-[90%] lg:w-[500px] p-6 gap-6'>
      <DialogHeader>
        <DialogTitle className='text-xl lg:text-2xl font-semibold text-left'>
          End Simulation
        </DialogTitle>
        <DialogDescription className='!mt-6 text-sm text-left'>
          This will stop the remaining time and complete the simulation. Are you
          sure you want to end the simulation?
        </DialogDescription>
      </DialogHeader>

      <div className='flex flex-col lg:flex-row items-center justify-end gap-6'>
        <Button
          variant='outline'
          disabled={isSubmitting}
          className='w-full lg:w-fit'
          onClick={() => setOpen(!open)}
        >
          No, Continue
        </Button>
        <EndSimulationBtn
          btnText='Yes, End Simulation'
          setIsLoading={setIsSubmitting}
        />
      </div>
    </DialogContent>
  )
}

export default StopSimulationContent
