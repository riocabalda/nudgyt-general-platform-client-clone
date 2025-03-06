'use client'

import React from 'react'
import { Loader } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useGetSimulation } from '../hooks/useGetSimulation'
import { Role } from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/types/simulationFormTypes'
import SimulationActive from './SimulationActive'
import FetchError from '@/app/(shared)/components/FetchError'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import MainContainer from '@/app/(shared)/components/MainContainer'
import SimulationComplete from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/components/SimulationComplete'

function SimulationContainer() {
  const { simulationId } = useParams<{ simulationId: string }>()
  const { orgSlug } = useOrganization()

  const { simulationData, isLoading, error } = useGetSimulation(
    orgSlug,
    String(simulationId)
  )

  const activeSimulation = simulationData?.ended_at === null
  const mobileTitle = activeSimulation ? 'Simulation' : 'Rate Simulation'

  const render = () => {
    if (activeSimulation)
      return simulationData && <SimulationActive simulation={simulationData} />
    return <SimulationComplete role={Role.TRAINER} isTrialResults={true} />
  }

  if (error)
    return (
      <div className='grid place-items-center p-4'>
        <FetchError errorMessage={error?.response?.data?.message} />
      </div>
    )

  if (isLoading)
    return (
      <div className='grid place-items-center p-4'>
        <Loader className='w-4 h-4 mr-2 animate-spin' />
      </div>
    )
  return (
    <MainContainer
      className='overflow-hidden'
      headerMobile={<MainContainer.HeaderMobile title={mobileTitle} />}
      hideSidebar
    >
      {render()}
    </MainContainer>
  )
}

export default SimulationContainer
