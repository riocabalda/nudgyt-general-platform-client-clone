import React, { useState } from 'react'
import { Button } from '@/app/(shared)/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/(shared)/components/ui/dialog'
import { OldSubscription } from '@/app/(shared)/services/admin/subscriptionService'
import EditSubscriptionForm from './EditSubscriptionForm'

function EditSubscriptionModal({
  subscription
}: {
  subscription: OldSubscription
}) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='mt-6 ml-auto h-fit !px-12 py-2 block !text-sm font-medium bg-transparent text-foreground-800 hover:bg-brandcolora/10'
        >
          Edit Tier
        </Button>
      </DialogTrigger>
      <DialogContent className='!rounded-[8px] lg:p-6 w-full max-w-[600px] gap-0'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold lg:text-2xl text-foreground'>
            Edit Tier
          </DialogTitle>
        </DialogHeader>
        <EditSubscriptionForm
          onCancel={() => setOpen(false)}
          subscription={subscription}
        />
      </DialogContent>
    </Dialog>
  )
}

export default EditSubscriptionModal
