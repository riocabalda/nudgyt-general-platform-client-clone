import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/app/(shared)/components/ui/dialog'
import { Button } from '@/app/(shared)/components/ui/button'
import { useCharacterFormStore } from '../../hooks/useCharacterFormStore'
import { useRouter } from 'next/navigation'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useGetCharacter from '../../hooks/useGetCharacter'

export default function UnsavedChangesModal() {
  const { setShowUnsavedModal, showUnsavedModal } = useCharacterFormStore()
  const router = useRouter()
  const { orgSlug } = useOrganization()
  const { character } = useGetCharacter()

  const handleDiscard = () => {
    setShowUnsavedModal(false)
    router.push(`/${orgSlug}/admin/characters/${character?.data?.details?._id}`)
  }

  return (
    <Dialog open={showUnsavedModal}>
      <DialogContent hideCloseButton={true}>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            Edit Character
          </DialogTitle>
          <DialogDescription className='text-neutral-gray-500 text-base space-y-4 mt-4'>
            <p>
              This character&apos;s changes has not been saved. Any unsaved
              changes will be discarded.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='grid grid-cols-2 gap-2 mt-4'>
          <Button
            variant='outline'
            onClick={() => {
              setShowUnsavedModal(false)
            }}
          >
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
