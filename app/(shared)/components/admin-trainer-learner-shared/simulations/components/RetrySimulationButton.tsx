'use client'

import React, { useState } from 'react'
import { Loader, Play } from 'lucide-react'
import { Button } from '@/app/(shared)/components/ui/button'
import { useRouter } from 'next/navigation'
import simulationService from '@/app/(shared)/services/learner/simulationService'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { useGetService } from '@/app/[organization]/learner/services/hooks/useGetService'
import useGetSimulationResults from '../hooks/useGetSimulationResults'

function RetrySimulationButton() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { simulationServiceDetails } = useGetSimulationResults()
  const { orgSlug } = useOrganization()

  const { serviceData, isLoading: isServiceLoading } = useGetService(
    orgSlug,
    simulationServiceDetails?.data?.service._id as string
  )

  const hasFormAnswers = serviceData?.basic_level.form_questions.length

  const handleStartSimulationClick = async () => {
    setIsSubmitting(true)

    try {
      const payloadIds = {
        serviceId: simulationServiceDetails?.data?.service._id || '',
        serviceLevelId: simulationServiceDetails?.data?.service_level._id || ''
      }
      const { data } = await simulationService.startSimulation(
        orgSlug,
        payloadIds
      )

      router.replace(
        `/${orgSlug}/learner/simulations/${data.data._id}?panel=${hasFormAnswers ? 'form' : 'profile'}`
      )
    } catch (error: any) {
      console.log(error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className='space-y-2'>
      <Button
        disabled={isSubmitting || isServiceLoading}
        onClick={handleStartSimulationClick}
        className='w-full lg:w-auto flex items-center gap-[10px]'
      >
        {isSubmitting ? (
          <>
            <Loader className='size-[20px] animate-spin' />
            <span>
              {isServiceLoading ? 'Initializing' : 'Starting Simulation'}
            </span>
          </>
        ) : (
          <>
            <Play size={20} />
            <span>Retry Simulation</span>
          </>
        )}
      </Button>
    </div>
  )
}

export default RetrySimulationButton
