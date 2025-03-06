'use client'

import React from 'react'
import { Button } from '@/app/(shared)/components/ui/button'
import { Loader } from 'lucide-react'
import { useServiceStore } from '../../../create/hooks/useServiceStore'
import serviceService from '@/app/(shared)/services/admin/serviceService'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { useRouter, useParams } from 'next/navigation'
import { timeStringToMillisec } from '@/app/(shared)/utils'
import useGetService from '../../hooks/useGetService'

function DraftServiceButton() {
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

  const canUserSaveDraft =
    serviceTypeId ||
    title ||
    description ||
    (timelimit && customTimeLimit) ||
    environmentId ||
    (characterIds?.length ?? 0) > 0

  const handleSaveClick = async () => {
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
      const { data } = await serviceService.editService(
        orgSlug,
        String(serviceId),
        payload
      )
      mutate()
      router.replace(`/${orgSlug}/admin/services/${data.data._id}`)
    } catch (error: any) {
      setIsSubmitting(false)
      console.log(error)
    }
  }

  return (
    <Button
      className='w-full lg:w-fit bg-brandcolorf'
      onClick={handleSaveClick}
      disabled={isSubmitting || !canUserSaveDraft}
    >
      {isSubmitting ? (
        <>
          <Loader className='w-4 h-4 mr-2 animate-spin' /> Saving Draft
        </>
      ) : (
        <>
          <span className='hidden lg:block'>Save Draft</span>
          <span className='lg:hidden flex items-center gap-[26px]'>
            Save Draft
          </span>
        </>
      )}
    </Button>
  )
}

export default DraftServiceButton
