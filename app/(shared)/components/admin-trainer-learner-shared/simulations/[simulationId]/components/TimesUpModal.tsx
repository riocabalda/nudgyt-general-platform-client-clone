import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/app/(shared)/components/ui/dialog'

function TimesUpModal({
  endSimulationBtn
}: {
  endSimulationBtn: React.ReactNode
}) {
  return (
    <Dialog open={true}>
      <DialogContent
        className='gap-0 w-[90vw] lg:w-[500px] rounded-[8px]'
        hideCloseButton={true}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader className='flex flex-row items-start justify-between'>
          <DialogTitle className='text-xl lg:text-2xl font-semibold text-left'>
            Time&apos;s up
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className='!mt-6 text-sm text-left'>
          Your allotted time for this service has ended.
        </DialogDescription>
        <div className='flex flex-col lg:flex-row items-center justify-end gap-6 mt-6'>
          {endSimulationBtn}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TimesUpModal
