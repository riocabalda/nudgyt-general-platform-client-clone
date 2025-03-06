import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/app/(shared)/components/ui/dialog'
import { Button } from '@/app/(shared)/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import serviceService from '@/app/(shared)/services/admin/serviceService'
import { timeStringToMillisec } from '@/app/(shared)/utils'
import { useServiceStore } from '../../../create/hooks/useServiceStore'
import useGetService from '../../hooks/useGetService'
import { Loader } from 'lucide-react'

type UnsavedEditServiceChangesModalProps = {
  isOpen: boolean
  onClose: () => void
}

const UnsavedEditServiceChangesModal = ({
  isOpen,
  onClose
}: UnsavedEditServiceChangesModalProps) => {
  const router = useRouter()
  const { orgSlug } = useOrganization()
  const { serviceId } = useParams()

  const { mutate } = useGetService(orgSlug, String(serviceId))

  const {
    isSubmitting,
    characterIds,
    environmentId,
    title,
    description,
    currentStep,
    timelimit,
    customTimeLimit,
    serviceTypeId,
    rubrics,
    formQuestions,
    setIsSubmitting
  } = useServiceStore()

  const handleSaveAsDraft = async () => {
    setIsSubmitting(true)
    let timeLimitInSeconds = 0
    const timeLimit = customTimeLimit ? customTimeLimit : timelimit

    if (timelimit === 'unlimited') {
      timeLimitInSeconds = -1
    } else {
      timeLimitInSeconds = timeLimit ? timeStringToMillisec(timeLimit) : 0
    }

    const payload = new FormData()
    payload.append('characters', String(characterIds))
    payload.append('environment', String(environmentId))
    payload.append('service_type', String(serviceTypeId))
    payload.append('title', String(title))
    payload.append('description', String(description))
    payload.append('current_step', String(currentStep))
    payload.append('time_limit', String(timeLimitInSeconds))

    if (rubrics) {
      payload.append('rubrics', rubrics as Blob)
    }

    if (formQuestions) {
      payload.append('form_questions', formQuestions as Blob)
    }

    try {
      await serviceService.editService(orgSlug, String(serviceId), payload)
      window.history.replaceState(null, '', window.location.href)
      await mutate()
      setTimeout(() => {
        router.replace(`/${orgSlug}/admin/services/${serviceId}`)
      }, 100)
    } catch (error: any) {
      setIsSubmitting(false)
      console.log('Error:', error)
    }
  }

  const handleDiscard = () => {
    onClose()
    router.push(`/${orgSlug}/admin/services/${serviceId}`)
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent hideCloseButton={true} className='p-[24px]'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            Save as draft
          </DialogTitle>
          <DialogDescription className='text-neutral-gray-700 text-base space-y-4 mt-4'>
            <p>
              This service has not been saved. Any unsaved changes will be
              discarded.
            </p>
            <p>Do you want to save it as a draft to work on it later?</p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='grid grid-cols-2 gap-2 mt-4'>
          <Button variant='outline' onClick={handleDiscard}>
            No, cancel and discard
          </Button>
          <Button onClick={handleSaveAsDraft} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className='size-[16px] mr-2 animate-spin' />
                Saving draft
              </>
            ) : (
              'Yes, save as draft'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UnsavedEditServiceChangesModal
