'use client'

import React from 'react'
import { Button } from '@/app/(shared)/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Step, useServiceStore } from '../../../create/hooks/useServiceStore'

function NextStepButton({
  nextStep,
  disabled
}: {
  nextStep: Step
  disabled?: boolean
}) {
  const { setCurrentStep } = useServiceStore()
  return (
    <Button
      onClick={() => setCurrentStep(nextStep)}
      className='flex justify-center lg:justify-between gap-[10px] w-full lg:w-[161px]'
      disabled={disabled}
    >
      <span className='px-4'>Next</span>
      <ArrowRight className='hidden lg:block size-[20px]' />
    </Button>
  )
}

export default NextStepButton
