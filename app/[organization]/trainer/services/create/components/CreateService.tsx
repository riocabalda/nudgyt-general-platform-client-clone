'use client'

import React, { useEffect, useLayoutEffect } from 'react'
import { useServiceStore } from '../hooks/useServiceStore'
import ServiceType from './ServiceType'
import StepButton from './StepButton'
import ServiceDetails from './ServiceDetails'
import Environment from './Environment'
import Character from './Character'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { useSearchParams } from 'next/navigation'
import useGetTemplate from '@/app/[organization]/trainer/templates/[templateId]/hooks/useGetTemplate'
import { millisecondsToTimeString } from '@/app/(shared)/utils'

function CreateService() {
  const { orgSlug } = useOrganization()
  const searchParams = useSearchParams()
  const templateId = searchParams.get('templateId')

  const { data: templateData } = useGetTemplate(
    String(orgSlug),
    templateId || null
  )

  const {
    currentStep,
    serviceTypeId,
    title,
    description,
    environmentId,
    characterIds,
    setTimelimit,
    setCustomTimeLimit,
    setServiceTypeId,
    setTitle,
    setDescription,
    setEnvironmentId,
    setCharacterIds,
    setServiceHasForm,
    setFormQuestions,
    setRubrics,
    reset,
    setTemplateId
  } = useServiceStore()

  useEffect(() => {
    if (templateData) {
      const timeString = millisecondsToTimeString(
        templateData.data?.time_limit || 0
      )

      if (
        ['00:15:00', '00:30:00', '01:00:00', 'unlimited'].includes(timeString)
      ) {
        setTimelimit(timeString)
        setCustomTimeLimit('')
      } else {
        setTimelimit('custom')
        setCustomTimeLimit(timeString)
      }
      setServiceTypeId(templateData.data.service_type?._id || '')
      setTitle(templateData.data?.title || '')
      setDescription(templateData.data?.description || '')
      setEnvironmentId(templateData.data.environment?._id || '')
      setCharacterIds(
        templateData.data.characters?.map((character: any) => character._id) ||
          []
      )
      setTemplateId(templateId)
      setServiceHasForm(templateData.data.form_questions?.length > 0)
      setFormQuestions(
        templateData.data.form_questions?.length > 0
          ? templateData.data.form_questions
          : null
      )
      setRubrics(templateData.data.rubrics?._id || null)
    }
  }, [templateData])

  useLayoutEffect(() => {
    reset()
  }, [])

  const renderView = () => {
    switch (currentStep) {
      case 0:
        return <ServiceType />
      case 1:
        return <ServiceDetails />
      case 2:
        return <Environment />
      case 3:
        return <Character />
      default:
        return null
    }
  }

  return (
    <div className='lg:px-[40px]'>
      {currentStep !== 0 && (
        <div className='px-[6px] lg:px-0 flex items-center gap-[8px] lg:w-max mx-auto my-[24px] overflow-x-auto'>
          <StepButton
            isActive={currentStep === 1}
            isCompleted={!!serviceTypeId && !!title && !!description}
            text='Details'
            stepNum={1}
          />
          <span className='h-0 w-[40px] border-t border-muted-foreground'></span>
          <StepButton
            isActive={currentStep === 2}
            isCompleted={!!environmentId}
            text='Environment'
            stepNum={2}
          />
          <span className='h-0 w-[40px] border-t border-muted-foreground'></span>
          <StepButton
            isActive={currentStep === 3}
            isCompleted={!!characterIds?.length}
            text='Character'
            stepNum={3}
          />
        </div>
      )}
      {renderView()}
    </div>
  )
}

export default CreateService
