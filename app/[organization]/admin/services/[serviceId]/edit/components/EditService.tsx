'use client'

import React, { useEffect, useLayoutEffect } from 'react'
import { useServiceStore } from '../../../create/hooks/useServiceStore'
import ServiceType from './ServiceType'
import StepButton from './StepButton'
import ServiceDetails from './ServiceDetails'
import Environment from './Environment'
import Character from './Character'
import { useParams } from 'next/navigation'
import useGetService from '../../hooks/useGetService'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { millisecondsToTimeString } from '@/app/(shared)/utils'
function EditService() {
  const { serviceId } = useParams()
  const { orgSlug } = useOrganization()

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
    reset
  } = useServiceStore()

  const { serviceData } = useGetService(orgSlug, String(serviceId))

  useEffect(() => {
    if (serviceData) {
      const timeString = millisecondsToTimeString(
        serviceData.basic_level.time_limit
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
      setServiceTypeId(serviceData.service_type?._id || '')
      setTitle(serviceData.basic_level?.title || '')
      setDescription(serviceData.basic_level?.description || '')
      setEnvironmentId(serviceData.basic_level?.environment?._id || '')
      setCharacterIds(
        serviceData.basic_level?.characters?.map(
          (character: any) => character._id
        ) || []
      )
      setServiceHasForm(serviceData.basic_level?.form_questions?.length > 0)
      setFormQuestions(
        serviceData.basic_level?.form_questions?.length > 0
          ? serviceData.basic_level?.form_questions
          : null
      )
      setRubrics(serviceData.basic_level?.rubrics?._id || null)
    }
  }, [serviceData])

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

export default EditService
