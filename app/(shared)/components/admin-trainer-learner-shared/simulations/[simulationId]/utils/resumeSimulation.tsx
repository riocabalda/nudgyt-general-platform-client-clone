import AdminSimulationService from '@/app/(shared)/services/admin/simulationService'
import TrainerSimulationService from '@/app/(shared)/services/trainer/simulationService'
import LearnerSimulationService from '@/app/(shared)/services/learner/simulationService'
import { Service as AdminService } from '@/app/(shared)/services/admin/serviceService'
import { Service as TrainerService } from '@/app/(shared)/services/trainer/serviceService'
import { Service as LearnerService } from '@/app/(shared)/services/learner/serviceService'
import { Role } from '@/app/(shared)/types'

type ResumeSimulationProps = {
  serviceData: AdminService | TrainerService | LearnerService
  simulationService:
    | typeof AdminSimulationService
    | typeof TrainerSimulationService
    | typeof LearnerSimulationService
  orgSlug: string
  simulationId: string
  simulationLink: string
  role: Role
  initializeCharacter: (
    characterId: string,
    environmentId: string,
    personalityId: string
  ) => void
  setIsPlayPressed: (isPlayPressed: boolean) => void
  mutateSimulation: () => void
}

async function resumeSimulation({
  serviceData,
  simulationService,
  orgSlug,
  simulationId,
  role,
  initializeCharacter,
  setIsPlayPressed,
  mutateSimulation,
  simulationLink
}: ResumeSimulationProps) {
  try {
    // Get the character ID, environment ID, and personality ID from the service data.
    const characterId =
      serviceData?.basic_level.characters[0].avatar.mesh_id ?? '000'
    const environmentId =
      serviceData?.basic_level.environment.environment_id ?? '000'
    const personalityId = serviceData?.basic_level.characters[0].personality_id

    // If the role is Admin or Trainer, use resumeSimulationTrial.
    // If the role is Learner, use resumeSimulation.
    if (role === Role.ADMIN || role === Role.TRAINER) {
      await (
        simulationService as
          | typeof AdminSimulationService
          | typeof TrainerSimulationService
      ).resumeSimulationTrial(orgSlug, String(simulationId))
    } else {
      await (
        simulationService as typeof LearnerSimulationService
      ).resumeSimulation(orgSlug, String(simulationId))
    }

    // If the character ID, environment ID, and personality ID are available,
    // initialize the character, set the play state to true, and mutate the simulation.
    if (characterId && environmentId && personalityId) {
      initializeCharacter(characterId, environmentId, personalityId)
      setIsPlayPressed(true)
    }

    // Mutate the simulation to ensure the latest simulation data is fetched.
    mutateSimulation()
  } catch (error) {
    // If an error occurs, try to reload the simulation and relaunch eagle3d stream.
    const iframe = document.getElementById('iframe_1') as HTMLIFrameElement
    if (iframe && iframe.src) {
      const currentSrc = iframe.src
      iframe.src = simulationLink
      setTimeout(() => {
        iframe.src = currentSrc
      }, 100)
    }
    console.error(error)
  }
}

export default resumeSimulation
