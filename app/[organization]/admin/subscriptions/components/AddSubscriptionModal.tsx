import React, { useState } from 'react'
import { Button } from '@/app/(shared)/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/(shared)/components/ui/dialog'
import AddSubscriptionForm from './AddSubscriptionForm'

function EditSubscriptionModal() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='mt-6 ml-auto h-fit !px-12 py-2 block !text-sm font-medium bg-transparent  text-foreground-800 hover:bg-brandcolora/10'
        >
          Add Tier
        </Button>
      </DialogTrigger>
      <DialogContent className='!rounded-[8px] lg:p-6 w-full max-w-[600px] gap-0'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold lg:text-2xl text-foreground'>
            Add Tier
          </DialogTitle>
        </DialogHeader>
        <AddSubscriptionForm onCancel={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

export default EditSubscriptionModal
