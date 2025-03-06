import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { roles } from '@/app/(shared)/services/userService'
import { orgPrefixRoute } from '@/app/(shared)/utils'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import z from 'zod'

export const loadSimulationService = async (role: string) => {
  switch (role) {
    case roles.superadmin:
    case roles.admin:
      return (await import('@/app/(shared)/services/admin/simulationService'))
        .default
    case roles.trainer:
      return (await import('@/app/(shared)/services/trainer/simulationService'))
        .default
    case roles.learner:
      return (await import('@/app/(shared)/services/learner/simulationService'))
        .default
    default:
      return (await import('@/app/(shared)/services/learner/simulationService'))
        .default
  }
}

export const loadTranscriptService = async (role: string) => {
  switch (role) {
    case roles.superadmin:
    case roles.admin:
      return (await import('@/app/(shared)/services/admin/transcriptService'))
        .default
    case roles.trainer:
      return (await import('@/app/(shared)/services/trainer/transcriptService'))
        .default
    case roles.learner:
      return (await import('@/app/(shared)/services/learner/transcriptService'))
        .default
    default:
      return (await import('@/app/(shared)/services/learner/transcriptService'))
        .default
  }
}

export const loadCharacterService = async (role: string) => {
  switch (role) {
    case roles.superadmin:
    case roles.admin:
      return (await import('@/app/(shared)/services/admin/characterService'))
        .default
    case roles.trainer:
      return (await import('@/app/(shared)/services/trainer/characterService'))
        .default
    case roles.learner:
      return (await import('@/app/(shared)/services/learner/characterService'))
        .default
    default:
      return (await import('@/app/(shared)/services/learner/characterService'))
        .default
  }
}

// TODO Remove when simulation type/service is updated with corresponding data

export const HARD_CODED_DATA = {
  /** Not sure what "keys" would these fall into */
  ...{
    question_option_display: {
      disclaimer:
        "Accurate assessment requires conversations with staff, family or others who have direct knowledge of the person's behaviour over this time."
    }
  }
}

const RouteParamsSchema = z.object({
  simulationId: z.string()
})

function useRouteParams() {
  const rawParams = useParams()
  const params = RouteParamsSchema.parse(rawParams)

  return params
}

function useGetSimulationResults() {
  const { simulationId } = useRouteParams()
  const { orgSlug, membership } = useOrganization()
  const role = membership?.roles[0]
  const rolePrefix = orgPrefixRoute(membership?.roles || [])
  const {
    data: simulationServiceDetails,
    isLoading: isSimulationServiceDetailsLoading,
    error: isSimulationServiceDetailsError
  } = useSWR(
    `/${orgSlug}/${rolePrefix}/simulations/${simulationId}/service-details`,
    async () => {
      const simulationService = await loadSimulationService(role || '')
      return simulationService
        .getSimulationServiceDetails(orgSlug, simulationId)
        .then((res) => res.data)
    }
  )
  const {
    data: simulationDetails,
    isLoading: isSimulationDetailsLoading,
    error: isSimulationDetailsError
  } = useSWR(
    `/${orgSlug}/${rolePrefix}/simulations/${simulationId}/details`,
    async () => {
      const simulationService = await loadSimulationService(role || '')
      return simulationService
        .getSimulationDetails(orgSlug, simulationId)
        .then((res) => res.data)
    }
  )
  const {
    data: simulationDates,
    isLoading: isSimulationDatesLoading,
    error: isSimulationDatesError
  } = useSWR(
    `/${orgSlug}/${rolePrefix}/simulations/${simulationId}/dates`,
    async () => {
      const simulationService = await loadSimulationService(role || '')
      return simulationService
        .getSimulationDates(orgSlug, simulationId)
        .then((res) => res.data)
    }
  )
  const {
    data: transcripts,
    mutate: transcriptsMutate,
    isLoading: isTranscriptsLoading,
    error: isTranscriptsError
  } = useSWR(
    `/${orgSlug}/${rolePrefix}/transcripts/${simulationId}`,
    async () => {
      const transcriptService = await loadTranscriptService(role || '')
      return transcriptService
        .getTranscriptsBySimulation(simulationId, orgSlug)
        .then((res) => res.data)
    }
  )
  const {
    data: voiceTypes,
    isLoading: isVoiceTypesLoading,
    error: isVoiceTypesError
  } = useSWR(`${orgSlug}/admin/characters/voice-types`, async () => {
    const characterService = await loadCharacterService(role || '')
    return characterService
      .getCharacterVoiceTypes(orgSlug)
      .then((res) => res.data)
  })
  const {
    data: softSkills,
    isLoading: isSoftSkillsLoading,
    error: isSoftSkillsError
  } = useSWR(
    `/${orgSlug}/admin/simulations/${simulationId}/soft-skills`,
    async () => {
      const simulationService = await loadSimulationService(role || '')
      return simulationService
        .getSimulationSoftSkills(orgSlug, simulationId)
        .then((res) => res.data)
    }
  )

  return {
    simulationDates,
    simulationServiceDetails,
    details: simulationDetails?.data,
    transcripts: transcripts?.data || [],
    transcriptsMutate,
    voiceTypes,
    softSkills,
    isSimulationServiceDetailsLoading,
    isSimulationDetailsLoading,
    isSimulationDatesLoading,
    isTranscriptsLoading,
    isVoiceTypesLoading,
    isSoftSkillsLoading,
    isSimulationServiceDetailsError,
    isSimulationDetailsError,
    isSimulationDatesError,
    isTranscriptsError,
    isVoiceTypesError,
    isSoftSkillsError
  }
}

export default useGetSimulationResults
