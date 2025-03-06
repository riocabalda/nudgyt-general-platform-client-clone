'use client'

import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '../../components/ui/dialog'
import PasswordForm from './PasswordForm'

function PasswordModal() {
  const router = useRouter()

  function goBackOnClose(open: boolean) {
    if (open) return

    router.back()
  }

  return (
    <Dialog open onOpenChange={goBackOnClose}>
      <DialogContent className='rounded-[8px] w-[90%] max-w-[560px] gap-[24px] p-6'>
        <DialogHeader className='flex flex-row items-start justify-between'>
          <DialogTitle className='text-lg font-semibold lg:text-2xl'>
            Change Password
          </DialogTitle>
        </DialogHeader>
        <PasswordForm />
      </DialogContent>
    </Dialog>
  )
}

export default PasswordModal
