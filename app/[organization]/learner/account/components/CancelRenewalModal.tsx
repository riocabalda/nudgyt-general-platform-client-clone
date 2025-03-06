'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@/app/(shared)/components/ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'
import { ReactNode } from 'react'

const END_BILLING_PERIOD_DATE = 'December 5, 2024'

function CancelRenewalModal(props: { body: ReactNode }) {
  const { body } = props

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Cancel renewal</Button>
      </DialogTrigger>

      <DialogContent hideCloseButton>
        <div className='space-y-4 lg:space-y-6'>
          <DialogTitle className='text-xl lg:text-2xl text-neutral-gray-800 font-semibold'>
            Cancel subscription
          </DialogTitle>
          <DialogDescription className='font-medium text-neutral-gray-800 lg:text-base'>
            Are you sure you want to cancel your subscription?
          </DialogDescription>

          <div className='space-y-4 lg:space-y-6'>
            <p className='font-medium text-neutral-gray-800 lg:text-base'>
              You will lose access to the following features:
            </p>

            {body}

            <p className='font-medium text-neutral-gray-800 lg:text-base'>
              Your plan will be canceled, you will still be able to access the
              platform until the end of your billing period on{' '}
              {END_BILLING_PERIOD_DATE}
            </p>

            <p className='font-medium text-neutral-gray-800 lg:text-base'>
              If you change your mind, you can renew your subscription.
            </p>
          </div>

          <footer className='grid lg:grid-cols-2 gap-4 lg:gap-6'>
            <DialogClose asChild>
              <Button variant='outline'>Go back</Button>
            </DialogClose>

            <Button className='bg-primary-500 hover:bg-primary-500/90 cursor-not-allowed'>
              Cancel subscription
            </Button>
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CancelRenewalModal
