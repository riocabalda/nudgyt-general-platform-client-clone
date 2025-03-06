'use client'

import React, { useEffect } from 'react'
import { Simulation } from '@/app/(shared)/services/learner/simulationService'
import RightSidebar from './RightSidebar'
import SimulationE3dsIframe from './SimulationE3dsIframe'
import NavigationPanel from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/components/NavigationPanel'
import authTokenService from '@/app/(shared)/services/authTokenService'
import useSimulationFormStore from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/hooks/useSimulationFormStore'
import serverConfig from '@/app/(shared)/config/serverConfig'
import io from 'socket.io-client'
function SimulationActive({ simulation }: { simulation: Simulation }) {
  const accessToken = authTokenService.getAccessToken()

  const { resetFormState } = useSimulationFormStore()

  useEffect(() => {
    const socket = io(serverConfig.socketUrl, {
      reconnection: true,
      auth: {
        accessToken: `Bearer ${accessToken}`,
        payload: { simulationId: simulation._id }
      }
    })

    return () => {
      socket.disconnect()
      resetFormState()
    }
  }, [])
  return (
    <section className='lg:p-6 lg:pb-0'>
      <div className='relative flex flex-col lg:flex-row lg:gap-6 overflow-hidden lg:max-w-[1920px] lg:mx-auto lg:px-0 '>
        <SimulationE3dsIframe />
        <RightSidebar />
        <div className='lg:hidden w-full fixed bottom-0'>
          <NavigationPanel simulationData={simulation} />
        </div>
      </div>
    </section>
  )
}

export default SimulationActive
