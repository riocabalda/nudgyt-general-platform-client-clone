import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/app/(shared)/components/ui/dialog'
import { Button } from '@/app/(shared)/components/ui/button'
import { useRouter } from 'next/navigation'
import useOrganization from '@/app/(shared)/hooks/useOrganization'

interface UnsavedChangesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UnsavedChangesModal({
  isOpen,
  onClose
}: UnsavedChangesModalProps) {
  const router = useRouter()
  const { orgSlug } = useOrganization()

  const handleDiscard = () => {
    router.push(`/${orgSlug}/admin/services`)
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent hideCloseButton={true}>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            Unsaved Changes
          </DialogTitle>
          <DialogDescription className='text-neutral-gray-500 text-base space-y-4 mt-4'>
            <p>
              You have unsaved changes. Any unsaved changes will be discarded.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='grid grid-cols-2 gap-2 mt-4'>
          <Button variant='outline' onClick={onClose}>
            Continue Editing
          </Button>
          <Button type='button' variant='destructive' onClick={handleDiscard}>
            Discard Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
