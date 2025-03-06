import React, { useEffect, useState } from 'react'
import { Loader, Play } from 'lucide-react'
import { formatDateTime } from '@/app/(shared)/utils'
import { useParams, useRouter } from 'next/navigation'
import { ServiceTypeEnum } from '@/app/(shared)/types'
import { Button } from '@/app/(shared)/components/ui/button'
import useGetService from '../hooks/useGetService'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import simulationService from '@/app/(shared)/services/trainer/simulationService'
import useGetSimulationsPreviousAttempt from '../hooks/useGetSimulationsPreviousAttempt'

function TryServiceBtn() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastPausedAt, setLastPausedAt] = useState<Date | null>(null)
  const [endedAt, setEndedAt] = useState<Date | null>(null)
  const { serviceId } = useParams()
  const { orgSlug } = useOrganization()
  const router = useRouter()

  const { serviceData, isLoading: isServiceLoading } = useGetService(
    orgSlug,
    String(serviceId)
  )
  const { data, isLoading: isPreviousAttemptsLoading } =
    useGetSimulationsPreviousAttempt(
      orgSlug,
      `service_id=${serviceId}&includeOngoing=true`
    )

  const hasFormAnswers = !!serviceData?.basic_level.form_questions.length
  const isOngoingSimulation = lastPausedAt && !endedAt

  const isBasicServiceLevel =
    serviceData?.service_type.type === ServiceTypeEnum.BASIC &&
    serviceData?.basic_level

  const hasEmptyServiceLevel = serviceData?.multi_level.some(
    (level) =>
      !level ||
      !level.characters.length ||
      typeof level.environment !== 'object' ||
      !level.title?.trim() ||
      !level.description?.trim()
  )

  const isServiceReadyToTry =
    serviceData &&
    !!serviceData.service_type &&
    (!!isBasicServiceLevel
      ? !!serviceData?.basic_level.characters.length &&
        !!serviceData?.basic_level.environment &&
        !!serviceData?.basic_level.title &&
        !!serviceData?.basic_level.description
      : !hasEmptyServiceLevel)

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

  const handleStartSimulation = async () => {
    setIsSubmitting(true)

    try {
      const payloadIds = {
        serviceId: String(serviceId),
        serviceLevelId: serviceData?.basic_level._id || ''
      }
      const { data } = await simulationService.startSimulationTrial(
        orgSlug,
        payloadIds
      )

      router.push(
        `/${orgSlug}/trainer/simulations/${data.data._id}?panel=${hasFormAnswers ? 'form' : 'profile'}`
      )
    } catch (error: any) {
      console.log(error)
      setIsSubmitting(false)
    }
  }
  return (
    <div className='relative space-y-2'>
      <Button
        disabled={
          !isServiceReadyToTry ||
          isSubmitting ||
          isServiceLoading ||
          isPreviousAttemptsLoading
        }
        variant='outline'
        onClick={handleStartSimulation}
        className='flex items-center w-full lg:gap-[10px] gap-4 text-neutral-gray-800'
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
                  {isOngoingSimulation ? 'Resume Simulation' : 'Try service'}
                </span>
              </>
            )}
          </>
        )}
      </Button>
      {isOngoingSimulation && (
        <p className='hidden lg:block absolute bottom-0 left-0 translate-y-6 text-xs text-muted-foreground text-center lg:text-left'>
          Last saved:{' '}
          <span className='font-semibold'>
            {formatDateTime(lastPausedAt.toString())}
          </span>
        </p>
      )}
    </div>
  )
}

export default TryServiceBtn
