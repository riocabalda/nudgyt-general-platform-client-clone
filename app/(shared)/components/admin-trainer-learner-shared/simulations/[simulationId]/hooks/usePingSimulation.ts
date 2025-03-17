import { useEffect } from 'react'
import useCharacterStore from './useCharacterStore'
import AdminSimulationService from '@/app/(shared)/services/admin/simulationService'
import TrainerSimulationService from '@/app/(shared)/services/trainer/simulationService'
import LearnerSimulationService from '@/app/(shared)/services/learner/simulationService'

function usePingSimulation({
  simulationService,
  orgSlug,
  simulationId
}: {
  simulationService:
    | typeof AdminSimulationService
    | typeof TrainerSimulationService
    | typeof LearnerSimulationService
  orgSlug: string
  simulationId: string
}) {
  const { isCharacterInitialized } = useCharacterStore()
  useEffect(() => {
    let pingInterval: NodeJS.Timeout
    if (isCharacterInitialized) {
      // Ping the simulation every 5 minutes
      pingInterval = setInterval(async () => {
        console.log('Ping')
        try {
          const res = await simulationService.pingSimulation(
            orgSlug,
            simulationId
          )
          console.log(res.data)
        } catch (error) {
          console.error(error)
        }
      }, 300000)
    }

    return () => {
      clearInterval(pingInterval)
    }
  }, [isCharacterInitialized])
}

export default usePingSimulation
