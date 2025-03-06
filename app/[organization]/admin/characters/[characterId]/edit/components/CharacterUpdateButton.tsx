import { Button } from '@/app/(shared)/components/ui/button'
import { useRouter } from 'next/navigation'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { useCharacterFormStore } from '../../hooks/useCharacterFormStore'
import { Loader } from 'lucide-react'

function CharacterUpdateButton() {
  const router = useRouter()
  const { orgSlug } = useOrganization()
  const {
    isReadyToSubmit,
    setIsReadyToSubmit,
    isDisableSaveButton,
    isSubmitting
  } = useCharacterFormStore()

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!isReadyToSubmit) {
      setIsReadyToSubmit(true)
    }
  }

  const handleCancel = () => {
    router.push(`/${orgSlug}/admin/characters`)
  }

  return (
    <div className='flex gap-2'>
      <Button variant='outline' onClick={handleCancel}>
        Cancel
      </Button>
      <Button
        type='button'
        className='bg-purple-shade-darkest2'
        onClick={handleSave}
        disabled={isDisableSaveButton || isSubmitting}
      >
        {isSubmitting ? (
          <div className='flex items-center gap-2'>
            <Loader className='w-4 h-4 animate-spin' />
            Saving
          </div>
        ) : (
          'Save'
        )}
      </Button>
    </div>
  )
}

export default CharacterUpdateButton
