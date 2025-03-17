'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/app/(shared)/components/ui/dialog'
import { ReactNode, useState } from 'react'

function UpgradeSuccessContent(props: { body: ReactNode }) {
  const { body } = props

  return (
    <div className='space-y-6'>
      <DialogHeader className='space-y-6'>
        <DialogTitle className='text-lg lg:text-2xl font-semibold text-foreground'>
          You&apos;re All Set!
        </DialogTitle>
      </DialogHeader>

      <DialogDescription className='font-medium'>
        You&apos;ve successfully upgraded to a paid account. Welcome to an even
        more powerful learning experience!
      </DialogDescription>

      {body}

      <p className='font-medium'>
        Start exploring your full potential now — your learning journey just got
        even better.
      </p>

      <DialogFooter className='grid lg:grid-cols-2 gap-6'>
        <DialogClose asChild>
          <Button className='lg:col-start-2'>Get started</Button>
        </DialogClose>
      </DialogFooter>
    </div>
  )
}

function UpgradePromptContent(props: {
  body: ReactNode
  proceedToPayment: () => void
}) {
  const { body, proceedToPayment } = props

  return (
    <div className='space-y-6'>
      <DialogHeader className='space-y-6'>
        <DialogTitle className='text-lg lg:text-2xl font-semibold text-foreground'>
          Confirm Upgrade
        </DialogTitle>
      </DialogHeader>

      <DialogDescription className='font-medium'>
        Are you sure you want to upgrade to this access?
      </DialogDescription>

      {body}

      <DialogFooter className='grid lg:grid-cols-2 gap-6'>
        <DialogClose asChild>
          <Button variant='outline'>Go back</Button>
        </DialogClose>

        <Button onClick={proceedToPayment}>Proceed to payment</Button>
      </DialogFooter>
    </div>
  )
}

function UpgradePlanModal(props: { body: ReactNode }) {
  const { body } = props
  const [mode, setMode] = useState<'prompt' | 'success'>('prompt')

  function proceedToPayment() {
    setMode('success')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='!px-12 py-2 block !text-sm font-medium bg-transparent text-foreground-800 hover:bg-brandcolora/10 disabled:bg-muted disabled:text-input'
        >
          Upgrade
        </Button>
      </DialogTrigger>

      <DialogContent
        hideCloseButton
        className='!rounded-[8px] p-6 w-full max-w-[600px] gap-0'
      >
        {mode === 'prompt' && (
          <UpgradePromptContent
            body={body}
            proceedToPayment={proceedToPayment}
          />
        )}
        {mode === 'success' && <UpgradeSuccessContent body={body} />}
      </DialogContent>
    </Dialog>
  )
}

export default UpgradePlanModal
