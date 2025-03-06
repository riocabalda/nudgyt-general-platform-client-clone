import AdminSimulationService from '@/app/(shared)/services/admin/simulationService'
import TrainerSimulationService from '@/app/(shared)/services/trainer/simulationService'
import LearnerSimulationService from '@/app/(shared)/services/learner/simulationService'
import { Role } from '@/app/(shared)/types'

type PauseSimulationProps = {
  simulationService:
    | typeof AdminSimulationService
    | typeof TrainerSimulationService
    | typeof LearnerSimulationService
  role: Role
  orgSlug: string
  simulationId: string
  resetFormState: () => void
  setSelectedPersonalityId: (personalityId: string | null) => void
  mutateSimulation: () => void
}

async function pauseSimulation({
  simulationService,
  role,
  orgSlug,
  simulationId,
  resetFormState,
  setSelectedPersonalityId,
  mutateSimulation
}: PauseSimulationProps) {
  try {
    // Check the role of the user. If the role is Admin or Trainer, use pauseSimulationTrial.
    // If the role is Learner, use pauseSimulation.
    if (role === Role.ADMIN || role === Role.TRAINER) {
      await (
        simulationService as
          | typeof AdminSimulationService
          | typeof TrainerSimulationService
      ).pauseSimulationTrial(orgSlug, String(simulationId))
    } else {
      await (
        simulationService as typeof LearnerSimulationService
      ).pauseSimulation(orgSlug, String(simulationId))
    }
    resetFormState()
    setSelectedPersonalityId(null)
    mutateSimulation()
  } catch (error) {
    console.error(error)
  }
}

export default pauseSimulation
