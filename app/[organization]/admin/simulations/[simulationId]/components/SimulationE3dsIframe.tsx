'use client'

import { useEffect, useState } from 'react'
import transcriptService, {
  TranscriptPayload
} from '@/app/(shared)/services/admin/transcriptService'
import {
  cleanAIResponse,
  initializeCharacter,
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
import StopwatchValueAndStopSimulationModal from './StopwatchValueAndStopSimulationModal'
import pauseSimulation from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/utils/pauseSimulation'
import resumeSimulation from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/utils/resumeSimulation'
import useCharacterStore from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/hooks/useCharacterStore'
import useSimulationFormStore from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/hooks/useSimulationFormStore'

function SimulationE3dsIframe() {
  const [isPlayPressed, setIsPlayPressed] = useState(false)

  const { orgSlug } = useOrganization()
  const { simulationId } = useParams()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams?.toString() ?? '')
  const navParam = params.get('panel')

  const {
    isCharacterInitialized,
    setCharacterInitialized,
    selectedPersonalityId,
    setSelectedPersonalityId,
    enableSelection: enableCharacterSelection,
    reset: resetCharacter
  } = useCharacterStore()

  const { resetFormState } = useSimulationFormStore()

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

  // To be Refactor
  // Hardcoded for now
  const simulationLink =
    'https://connector.eagle3dstreaming.com/v5/kathyu.168/Nudgyt_PicBG_v9/tridonicconfig'

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
            simulationLink,
            role: Role.ADMIN,
            initializeCharacter,
            setIsPlayPressed,
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

    if (isPlayPressed) setCharacterInitialized()

    window.addEventListener('message', eventHandler)
    return () => {
      window.removeEventListener('message', eventHandler)
      resetCharacter()
    }
  }, [selectedPersonalityId, serviceData, isPlayPressed])

  // Pause the simulation when the component unmounts
  useEffect(() => {
    return () => {
      pauseSimulation({
        simulationService: simulationService,
        role: Role.ADMIN,
        orgSlug: orgSlug,
        simulationId: String(simulationId),
        resetFormState: resetFormState,
        setSelectedPersonalityId: setSelectedPersonalityId,
        mutateSimulation: mutateSimulation
      })
    }
  }, [])

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
      ></iframe>
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
