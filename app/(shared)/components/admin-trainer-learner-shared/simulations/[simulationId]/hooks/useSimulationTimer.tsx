import { useEffect } from 'react'
import { useStopwatch, useTimer } from 'react-timer-hook'
import { getSimulationUsedTime, msToTime } from '@/app/(shared)/utils'
import { Simulation } from '@/app/(shared)/services/learner/simulationService'
import useCharacterStore from './useCharacterStore'

export const useSimulationTimer = (
  simulationData: Simulation,
  isSimulationValidating: boolean
) => {
  const { isCharacterInitialized } = useCharacterStore()
  const { time_limit: timeLimit } = simulationData

  const hasTimeLimit = Boolean(timeLimit && timeLimit > 0)
  const usedTime = getSimulationUsedTime(simulationData)
  const timeRemaining = hasTimeLimit ? (timeLimit || 0) - usedTime : usedTime

  const initialTime = msToTime(timeRemaining)
  let currentTime = { ...initialTime }

  // Timer setup for time-limited simulations
  const timer = useTimer({
    expiryTimestamp: new Date(new Date().getTime() + 0),
    autoStart: false
  })

  // Stopwatch setup for unlimited simulations
  const stopwatch = useStopwatch({
    offsetTimestamp: new Date(0),
    autoStart: false
  })

  useEffect(() => {
    if (!simulationData || !isCharacterInitialized || isSimulationValidating)
      return

    if (hasTimeLimit) {
      const expiryTimestamp = new Date(Date.now() + timeRemaining)
      timer.restart(expiryTimestamp)
    } else {
      const offsetTimestamp = new Date(Date.now() + usedTime)
      stopwatch.reset(offsetTimestamp)
    }
  }, [
    simulationData.paused_at.length,
    isCharacterInitialized,
    isSimulationValidating
  ])

  // Update current time based on timer type
  if (isCharacterInitialized && !isSimulationValidating) {
    currentTime = hasTimeLimit
      ? {
          totalSeconds: timer.totalSeconds,
          seconds: timer.seconds,
          minutes: timer.minutes,
          hours: timer.hours
        }
      : {
          totalSeconds: -1,
          seconds: stopwatch.seconds,
          minutes: stopwatch.minutes,
          hours: stopwatch.hours
        }
  }

  return { ...currentTime, hasTimeLimit }
}
