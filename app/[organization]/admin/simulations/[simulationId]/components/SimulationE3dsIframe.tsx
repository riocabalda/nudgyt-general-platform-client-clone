'use client'

import { useEffect } from 'react'
import transcriptService, {
  TranscriptPayload
} from '@/app/(shared)/services/admin/transcriptService'
import {
  cleanAIResponse,
  replaceLongSpacesWithNewline
} from '@/app/(shared)/utils'
import simulationService, {
  Simulation
} from '@/app/(shared)/services/admin/simulationService'
import { useGetSimulation } from '../hooks/useGetSimulation'
import { useParams, useSearchParams } from 'next/navigation'
import { useGetTranscripts } from '../hooks/useGetTranscripts'
import { ConvaiResponseEnum, Role } from '@/app/(shared)/types'
import { Service } from '@/app/(shared)/services/admin/serviceService'
import FetchError from '@/app/(shared)/components/FetchError'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import SimulationFloatingActionButton from './SimulationFloatingActions'
import useGetService from '../../../services/[serviceId]/hooks/useGetService'
import useWebSocket from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/hooks/useWebSocket'
import useReloadEagle3d from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/hooks/useReloadEagle3d'
import resumeSimulation from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/utils/resumeSimulation'
import useCharacterStore from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/hooks/useCharacterStore'
import usePingSimulation from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/hooks/usePingSimulation'
import StopwatchValueAndStopSimulationModal from './StopwatchValueAndStopSimulationModal'

function SimulationE3dsIframe() {
  const { orgSlug } = useOrganization()
  const { simulationId } = useParams()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams?.toString() ?? '')
  const navParam = params.get('panel')

  // To be Refactor
  // Hardcoded for now
  const simulationLink =
    'https://connector.eagle3dstreaming.com/v5/kathyu.168/GeneralPlatform_PicBG_V10/default'

  const { reloadEagle3d } = useReloadEagle3d(simulationLink)
  const {
    isCharacterInitialized,
    selectedPersonalityId,
    setCharacterInitialized,
    setSelectedPersonalityId,
    enableSelection: enableCharacterSelection
  } = useCharacterStore()

  const {
    simulationData,
    mutate: mutateSimulation,
    isLoading: isSimulationLoading,
    error: simulationError,
    isValidating: isSimulationValidating
  } = useGetSimulation(orgSlug, String(simulationId))
  const {
    serviceData,
    isLoading: isServiceLoading,
    error: serviceError
  } = useGetService(orgSlug, simulationData?.service as string)

  useWebSocket(String(simulationId), mutateSimulation, reloadEagle3d)
  usePingSimulation({
    simulationService,
    orgSlug,
    simulationId: String(simulationId)
  })

  const { mutate } = useGetTranscripts(orgSlug, String(simulationId))

  const saveTranscript = async (transcriptData: TranscriptPayload) => {
    await transcriptService.saveTranscriptTrial(orgSlug, transcriptData)
    mutate()
  }

  useEffect(() => {
    if (serviceData && !selectedPersonalityId) {
      setSelectedPersonalityId(
        serviceData?.basic_level.characters[0].personality_id
      )
    }
  }, [serviceData])

  useEffect(() => {
    const eventHandler = async (event: MessageEvent) => {
      const isResponseFromE3dServer = event.data.type
      const isResponseFromConvai =
        typeof event.data === 'string' && event.data.includes('DialogueValue')

      if (isResponseFromE3dServer) {
        //  Initialize AI character when playBtnPressed
        if (event.data.type === 'stage5_playBtnPressed') {
          // Resume the simulation
          resumeSimulation({
            serviceData: serviceData as Service,
            simulationService: simulationService,
            orgSlug: orgSlug,
            simulationId: String(simulationId),
            reloadEagle3d,
            role: Role.ADMIN,
            setCharacterInitialized,
            mutateSimulation
          })
        }
      }

      if (isResponseFromConvai) {
        const data = replaceLongSpacesWithNewline(event.data)
        const parsedData = JSON.parse(data)
        const fromAiCharacter = parsedData.From === 'AI'

        if (!selectedPersonalityId) {
          console.warn(
            'No selected character for user transcript; will not be saved...'
          )
          return
        }

        if (parsedData.DialogueValue) {
          const personalityId =
            parsedData.From === ConvaiResponseEnum.AI
              ? parsedData.PersonalityID
              : selectedPersonalityId

          saveTranscript({
            fromType: fromAiCharacter
              ? ConvaiResponseEnum.CHARACTER
              : ConvaiResponseEnum.USER,
            simulationId: String(simulationId),
            dialogueValue: cleanAIResponse(parsedData.DialogueValue),
            personalityId: personalityId,
            characterName: parsedData.Name || parsedData[' Name'] || ''
          })
          enableCharacterSelection()
        }
      }
    }

    window.addEventListener('message', eventHandler)
    return () => {
      window.removeEventListener('message', eventHandler)
    }
  }, [selectedPersonalityId, serviceData])

  if (simulationError || serviceError)
    return (
      <div className='grid place-items-center p-4 text-white aspect-[100/61] h-[270px] w-full lg:h-full bg-black lg:rounded-[8px] lg:overflow-hidden'>
        <FetchError
          errorMessage={
            simulationError?.response?.data?.message ||
            serviceError?.response?.data?.message
          }
        />
      </div>
    )

  if (isSimulationLoading || isServiceLoading)
    return (
      <div className='grid place-items-center p-4 text-white aspect-[100/61] h-[270px] w-full lg:h-full bg-black lg:rounded-[8px] lg:overflow-hidden'></div>
    )

  return (
    <div className='relative aspect-[100/61] flex items-center justify-center h-[270px] w-full lg:h-full bg-black lg:rounded-[8px] lg:overflow-hidden'>
      <iframe
        allow='camera'
        id='iframe_1'
        src={simulationLink}
        width='100%'
        height='100%'
        allowFullScreen
        className='absolute top-0 left-0 w-full'
      />
      <div className='absolute top-0 right-0 lg:top-auto lg:right-auto lg:bottom-0 w-1/3 h-full lg:h-auto lg:w-full flex flex-col lg:flex-row items-end justify-between p-3 lg:px-6 lg:pb-6'>
        <StopwatchValueAndStopSimulationModal
          simulationData={simulationData as Simulation}
          isSimulationValidating={isSimulationValidating}
        />
        {isCharacterInitialized && navParam !== 'transcript' && (
          <SimulationFloatingActionButton
            serviceData={serviceData as Service}
          />
        )}
      </div>
    </div>
  )
}

export default SimulationE3dsIframe
