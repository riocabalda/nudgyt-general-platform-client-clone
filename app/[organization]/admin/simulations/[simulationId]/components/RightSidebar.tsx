'use client'

import React, { useEffect } from 'react'
import { Loader } from 'lucide-react'
import { Card } from '@/app/(shared)/components/ui/card'
import { useParams, useSearchParams } from 'next/navigation'
import { useGetSimulation } from '../hooks/useGetSimulation'
import { Service } from '@/app/(shared)/services/admin/serviceService'
import { Simulation } from '@/app/(shared)/services/admin/simulationService'
import {
  convertFormAnswersToObject,
  hasUnsavedFormData,
  isNonEmptyFormAnswer
} from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/utils/formUtils'
import Transcript from './Transcript'
import FetchError from '@/app/(shared)/components/FetchError'
import useUpdateFormAnswers from '../hooks/useUpdateFormAnswers'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useGetService from '../../../services/[serviceId]/hooks/useGetService'
import Form from '@/app/[organization]/admin/simulations/[simulationId]/components/Form'
import Tips from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/components/Tips'
import useCharacterStore from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/hooks/useCharacterStore'
import NavigationPanel from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/components/NavigationPanel'
import useSimulationFormStore from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/hooks/useSimulationFormStore'
import CharacterProfile from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/components/profile/CharacterProfile'
import useInitializeSimulationData from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/hooks/useInitializeSimulationData'

function RightSidebar() {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams?.toString() ?? '')
  const navParam = params.get('panel')

  const { simulationId } = useParams()
  const { orgSlug } = useOrganization()

  const {
    simulationData,
    isLoading: isLoadingSimulationData,
    error: errorSimulationData
  } = useGetSimulation(orgSlug, String(simulationId))

  const {
    serviceData,
    isLoading: isLoadingServiceData,
    error: errorServiceData
  } = useGetService(orgSlug, String(simulationData?.service))

  const { setCharactersCount } = useCharacterStore()
  const { formAnswers, formattedFormData, resetFormState } =
    useSimulationFormStore()

  const { setFormAnswersToDbNoDelay } = useUpdateFormAnswers(
    simulationData?._id as string
  )

  const simulationFormAnswers = convertFormAnswersToObject(
    simulationData as Simulation
  )
  // Check if there are any new/unsaved answers from the user.
  const hasUnsavedAnswers =
    hasUnsavedFormData(formAnswers, simulationFormAnswers) &&
    !!simulationData?.form_answers.length &&
    isNonEmptyFormAnswer(formAnswers)

  const isFormInitialized =
    !!serviceData?.basic_level.form_questions.length &&
    !!simulationData?.form_answers.length &&
    !!formattedFormData.length

  const renderForm = navParam === 'form' && isFormInitialized

  const renderTranscript = navParam === 'transcript'
  const renderCharacterProfile = navParam === 'profile'

  useInitializeSimulationData(serviceData, simulationData)

  useEffect(() => {
    return () => {
      resetFormState()
    }
  }, [])

  useEffect(() => {
    if (serviceData && serviceData?.basic_level.characters.length) {
      setCharactersCount(serviceData.basic_level.characters.length)
    }
  }, [simulationData, serviceData])

  useEffect(() => {
    // Update form answers in the database when there are new answers from users when changing the panel.
    if (navParam !== 'form' && hasUnsavedAnswers)
      setFormAnswersToDbNoDelay(formAnswers)
  }, [navParam, formAnswers])

  const render = () => {
    if (renderTranscript)
      return <Transcript serviceData={serviceData as Service} />
    if (renderForm) return <Form simulationData={simulationData} />
    if (renderCharacterProfile)
      return (
        <CharacterProfile
          characters={serviceData?.basic_level.characters || []}
        />
      )
  }

  if (errorServiceData || errorSimulationData)
    return (
      <FetchError
        errorMessage={
          (errorServiceData || errorSimulationData)?.response?.data?.message
        }
      />
    )

  if (isLoadingServiceData || isLoadingSimulationData)
    return (
      <Card className='flex-1 flex items-center justify-center rounded-[8px] h-[calc(100vh-346px)] lg:max-w-[400px] lg:min-w-[400px] lg:h-[687px]'>
        <Loader className='w-4 h-4 mr-2 animate-spin' />
        Loading...
      </Card>
    )
  return (
    <div className='flex flex-col lg:flex-1 h-[calc(100vh-346px)] lg:max-w-[400px] lg:min-w-[400px] lg:min-h-[620px] lg:h-[calc(100vh-48px)]'>
      {render()}
      <Tips />
      <div className='hidden lg:block'>
        <NavigationPanel simulationData={simulationData as Simulation} />
      </div>
    </div>
  )
}

export default RightSidebar
