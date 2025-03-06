'use client'

import { Loader } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import useAlertStore from '../components/alert/useAlertStore'
import { Button } from '../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../components/ui/dialog'
import useOrganization from '../hooks/useOrganization'
import userService, { PaginatedUser } from '../services/admin/userService'

function ArchiveUserModal(props: {
  user: PaginatedUser
  onCancel: () => void
}) {
  const { user, onCancel } = props

  const { showAlert } = useAlertStore()
  const { orgSlug } = useOrganization()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleArchiveClick = async () => {
    setIsSubmitting(true)
    try {
      await userService.archiveUser(orgSlug, user._id)

      showAlert({
        message: <p>User archived!</p>,
        variant: 'error'
      })
    } catch (error: any) {
      console.log(error)
      toast.error(error?.response?.data?.message || 'An error occurred.')
    }
  }

  const triggerCancel = () => {
    onCancel()
  }

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) triggerCancel()
      }}
    >
      <DialogContent className='rounded-[8px] w-[90%] max-w-[420px] gap-[20px] p-[30px]'>
        <DialogHeader>
          <DialogTitle>Archive User</DialogTitle>
          <DialogDescription className='text-destructive'>
            Warning: You are about to archive a user. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className='flex justify-end gap-[10px] mt-[30px]'>
          <Button type='button' variant='outline' onClick={triggerCancel}>
            Cancel
          </Button>
          <Button
            variant='destructive'
            type='submit'
            className='w-full'
            disabled={isSubmitting}
            onClick={handleArchiveClick}
          >
            {isSubmitting ? (
              <>
                <Loader className='w-4 h-4 mr-2 animate-spin' /> Archiving
              </>
            ) : (
              'Archive'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ArchiveUserModal
