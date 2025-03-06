'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/app/(shared)/components/ui/dialog'
import { useRouter } from 'next/navigation'
import OrganizationDetailsForm from './OrganizationDetailsForm'

function OrganizationProfileModal() {
  const router = useRouter()

  function goBack() {
    router.back()
  }

  function handleOpenChange(open: boolean) {
    if (open) return

    goBack()
  }

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className='rounded-[8px] w-[90%] max-w-[560px] gap-6 p-0 py-6'>
        <DialogHeader className='px-6'>
          <DialogTitle className='text-lg font-semibold lg:text-2xl'>
            Organization Details
          </DialogTitle>
          <DialogDescription className='sr-only'>bruh</DialogDescription>
        </DialogHeader>

        <div className='px-6 overflow-hidden'>
          <OrganizationDetailsForm />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OrganizationProfileModal
