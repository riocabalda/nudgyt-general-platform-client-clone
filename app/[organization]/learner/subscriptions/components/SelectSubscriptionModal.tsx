'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/(shared)/components/ui/dialog'
import { useState } from 'react'
import SubscriptionCard from './SubscriptionCard'
import { MockSubscription } from './Subscriptions'

function SelectSubscriptionModal(props: { subscription: MockSubscription }) {
  const { subscription } = props
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={subscription.selected}
          variant='outline'
          className='!px-12 py-2 block !text-sm font-medium bg-transparent  text-foreground-800 hover:bg-brandcolora/10 disabled:bg-muted disabled:text-input'
        >
          {subscription.selected ? 'Current plan' : 'Change plan'}
        </Button>
      </DialogTrigger>

      <DialogContent className='!rounded-[8px] p-6 w-full max-w-[600px] gap-0'>
        <div className='space-y-6'>
          <DialogHeader className='space-y-6'>
            <DialogTitle className='text-lg lg:text-2xl font-semibold text-foreground'>
              Confirm Subscription
            </DialogTitle>
            <DialogDescription className='font-medium text-neutral-gray-800 text-base'>
              Are you sure you want to select this subscription tier?
            </DialogDescription>
          </DialogHeader>

          <SubscriptionCard
            subscription={subscription}
            className='lg:min-h-fit border border-neutral-gray-400'
          />

          <DialogFooter>
            <Button className='ml-auto h-fit min-w-[158px] !px-8 py-3 font-medium cursor-not-allowed'>
              Confirm
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SelectSubscriptionModal
