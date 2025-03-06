'use client'

import React, { useEffect, useState } from 'react'
import { Loader, Play } from 'lucide-react'
import { Button } from '@/app/(shared)/components/ui/button'
import { useRouter, useParams } from 'next/navigation'
import { formatDateTime } from '@/app/(shared)/utils'
import { useGetService } from '../../hooks/useGetService'
import simulationService from '@/app/(shared)/services/learner/simulationService'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useGetSimulationsPreviousAttempt from '../../hooks/useGetSimulationsPreviousAttempt'

function StartSimulationButton() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastPausedAt, setLastPausedAt] = useState<Date | null>(null)
  const [endedAt, setEndedAt] = useState<Date | null>(null)

  const router = useRouter()
  const { serviceId } = useParams()
  const { orgSlug } = useOrganization()

  const { serviceData, isLoading: isServiceLoading } = useGetService(
    orgSlug,
    serviceId as string
  )

  const { data, isLoading: isPreviousAttemptsLoading } =
    useGetSimulationsPreviousAttempt(
      orgSlug,
      `service_id=${serviceId}&includeOngoing=true`
    )

  const hasFormAnswers = !!serviceData?.basic_level.form_questions.length
  const isOngoingSimulation = lastPausedAt && !endedAt

  useEffect(() => {
    setLastPausedAt(null)
    setEndedAt(null)

    if (data?.data?.length) {
      const lastSimulated = data?.data[0]
      const lastPausedAt =
        lastSimulated.paused_at[lastSimulated.paused_at.length - 1]
      if (!lastSimulated.ended_at && lastPausedAt) {
        setLastPausedAt(lastPausedAt)
        setEndedAt(lastSimulated.ended_at)
      }
    }
  }, [data])

  const handleStartSimulationClick = async () => {
    setIsSubmitting(true)

    try {
      const payloadIds = {
        serviceId: String(serviceId),
        serviceLevelId: serviceData?.basic_level._id || ''
      }
      const { data } = await simulationService.startSimulation(
        orgSlug,
        payloadIds
      )

      router.push(
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
        disabled={isSubmitting || isServiceLoading || isPreviousAttemptsLoading}
        onClick={handleStartSimulationClick}
        className='w-full lg:w-auto flex items-center gap-[10px]'
      >
        {isSubmitting ? (
          <>
            <Loader className='size-[20px] animate-spin' />
            <span>
              {isServiceLoading || isPreviousAttemptsLoading
                ? 'Initializing'
                : isSubmitting && isOngoingSimulation
                  ? 'Resuming Simulation'
                  : 'Starting Simulation'}
            </span>
          </>
        ) : (
          <>
            {isServiceLoading || isPreviousAttemptsLoading ? (
              <>
                <Loader className='size-[20px] animate-spin' />
                <span>Initializing</span>
              </>
            ) : (
              <>
                <Play size={20} />
                <span>
                  {isOngoingSimulation
                    ? 'Resume Simulation'
                    : 'Start Simulation'}
                </span>
              </>
            )}
          </>
        )}
      </Button>
      {isOngoingSimulation && (
        <p className='text-xs text-muted-foreground text-center lg:text-left'>
          Last saved:{' '}
          <span className='font-semibold'>
            {formatDateTime(lastPausedAt.toString())}
          </span>
        </p>
      )}
    </div>
  )
}

export default StartSimulationButton
