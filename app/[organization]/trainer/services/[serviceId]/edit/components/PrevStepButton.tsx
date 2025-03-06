'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import React from 'react'
import { Step, useServiceStore } from '../../../create/hooks/useServiceStore'

function PrevStepButton({ prevStep }: { prevStep: Step }) {
  const { setCurrentStep } = useServiceStore()
  return (
    <Button
      onClick={() => setCurrentStep(prevStep)}
      variant='outline'
      className='flex justify-center lg:justify-between bg-white gap-[10px] w-full lg:w-[161px]'
    >
      <ArrowLeft className='hidden lg:block size-[20px]' />
      <span className='px-4'>Back</span>
    </Button>
  )
}

export default PrevStepButton
