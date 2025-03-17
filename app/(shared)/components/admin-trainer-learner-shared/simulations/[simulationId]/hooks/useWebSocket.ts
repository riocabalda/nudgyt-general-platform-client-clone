import { useEffect } from 'react'
import io from 'socket.io-client'
import useCharacterStore from './useCharacterStore'
import serverConfig from '@/app/(shared)/config/serverConfig'
import useSimulationFormStore from './useSimulationFormStore'
import authTokenService from '@/app/(shared)/services/authTokenService'

const useWebSocket = (
  simulationId: string,
  mutateSimulation: () => void,
  reloadEagle3d: () => void
) => {
  const accessToken = authTokenService.getAccessToken()
  const { resetFormState } = useSimulationFormStore()
  const { reset: resetCharacterState, setCharacterInitialized } =
    useCharacterStore()

  useEffect(() => {
    const socket = io(serverConfig.socketUrl, {
      reconnection: true,
      auth: {
        accessToken: `Bearer ${accessToken}`,
        payload: { simulationId: simulationId }
      }
    })

    socket.on('time-updated', (data) => {
      if (simulationId === data.simulation_id) {
        reloadEagle3d()
        mutateSimulation()
        setCharacterInitialized(false)
      }
    })

    return () => {
      // Disconnect the WebSocket when the component unmounts
      socket.disconnect()
      resetFormState()
      resetCharacterState()
    }
  }, [simulationId])
}

export default useWebSocket
