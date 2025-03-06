'use client'

import React, { useEffect } from 'react'
import simulationService, {
  Simulation
} from '@/app/(shared)/services/learner/simulationService'
import RightSidebar from './RightSidebar'
import SimulationE3dsIframe from './SimulationE3dsIframe'
import NavigationPanel from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/components/NavigationPanel'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import authTokenService from '@/app/(shared)/services/authTokenService'
import useSimulationFormStore from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/[simulationId]/hooks/useSimulationFormStore'
import serverConfig from '@/app/(shared)/config/serverConfig'
import { io } from 'socket.io-client'

function SimulationActive({ simulation }: { simulation: Simulation }) {
  const accessToken = authTokenService.getAccessToken()
  const { orgSlug } = useOrganization()

  const { resetFormState } = useSimulationFormStore()

  useEffect(() => {
    const socket = io(serverConfig.socketUrl, {
      reconnection: true,
      auth: {
        accessToken: `Bearer ${accessToken}`,
        payload: { simulationId: simulation._id }
      }
    })

    // Set up 5-minute interval to ping the server and prevent sleep
    const intervalId = setInterval(
      async () => {
        try {
          const response = await simulationService.pingSimulation(orgSlug)
          console.log(
            `Server ping successful: ${response.data.message} at ${response.data.timestamp}`
          )
        } catch (error) {
          console.error('Failed to ping server:', error)
        }
      },
      5 * 60 * 1000
    ) // 5 minutes in milliseconds

    return () => {
      socket.disconnect()
      resetFormState()
      clearInterval(intervalId)
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
