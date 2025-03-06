'use client'

import React, { useLayoutEffect } from 'react'
import ServiceType from './ServiceType'
import StepButton from './StepButton'
import TemplateDetails from './TemplateDetails'
import Environment from './Environment'
import Character from './Character'
import { useTemplateStore } from '../hooks/useTemplateStore'

function CreateTemplate() {
  const {
    currentStep,
    serviceTypeId,
    title,
    description,
    environmentId,
    characterIds,
    reset
  } = useTemplateStore()

  useLayoutEffect(() => {
    reset()
  }, [])

  const renderView = () => {
    switch (currentStep) {
      case 0:
        return <ServiceType />
      case 1:
        return <TemplateDetails />
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

export default CreateTemplate
