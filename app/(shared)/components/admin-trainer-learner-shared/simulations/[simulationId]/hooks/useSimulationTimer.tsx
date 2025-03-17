import { useEffect, useState } from 'react'
import { useStopwatch, useTimer } from 'react-timer-hook'
import { getSimulationUsedTime } from '@/app/(shared)/utils'
import { Simulation } from '@/app/(shared)/services/learner/simulationService'
import useCharacterStore from './useCharacterStore'

export const useSimulationTimer = (simulationData: Simulation) => {
  const [showTimesUp, setShowTimesUp] = useState(false)
  const { isCharacterInitialized } = useCharacterStore()
  const { time_limit: timeLimit } = simulationData

  const hasTimeLimit = Boolean(timeLimit && timeLimit > 0)
  const usedTime = getSimulationUsedTime(simulationData)
  const timeRemaining = hasTimeLimit
    ? Math.max((timeLimit || 0) - usedTime, 0)
    : Math.max(usedTime, 0)

  const isSimulationStarted =
    simulationData.resumed_at.length === simulationData.paused_at.length

  const expiryTimestamp = new Date(Date.now() + timeRemaining)
  const offsetTimestamp = new Date(Date.now() + usedTime)

  // Timer setup for time-limited simulations
  const timer = useTimer({
    expiryTimestamp,
    autoStart: false
  })

  // Stopwatch setup for unlimited simulations
  const stopwatch = useStopwatch({
    offsetTimestamp,
    autoStart: false
  })

  useEffect(() => {
    if (simulationData && hasTimeLimit && timeRemaining <= 0) {
      setShowTimesUp(true)
    }
  }, [timeRemaining])

  useEffect(() => {
    const expiryTimestamp = new Date(Date.now() + timeRemaining)
    const offsetTimestamp = new Date(Date.now() + usedTime)

    // const pauseTime = () => {
    //   if (hasTimeLimit) {
    //     timer.restart(expiryTimestamp, false)
    //   } else {
    //     stopwatch.reset(offsetTimestamp, false)
    //   }
    // }

    // Pause simulation
    if (!isCharacterInitialized && !isSimulationStarted) {
      // pauseTime()
      return
    }

    // Start/Resume simulation
    if (hasTimeLimit) {
      timer.restart(expiryTimestamp)
    } else {
      stopwatch.reset(offsetTimestamp)
    }

    // return () => pauseTime()
  }, [
    simulationData.paused_at.length,
    simulationData.resumed_at.length,
    isCharacterInitialized
  ])

  const currentTime = hasTimeLimit
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

  return { ...currentTime, hasTimeLimit, showTimesUp }
}
