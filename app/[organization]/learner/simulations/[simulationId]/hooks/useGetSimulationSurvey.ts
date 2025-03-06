import simulationService from '@/app/(shared)/services/learner/simulationService'
import useSWR from 'swr'

export function useGetSimulationSurvey(orgSlug: string, simulationId: string) {
  const {
    data,
    isLoading: isLoadingSurvey,
    error: errorSurvey,
    mutate: mutateSurvey
  } = useSWR(`/${orgSlug}/learner/survey?simulation_id=${simulationId}`, () =>
    simulationService
      .getSimulationSurvey(orgSlug, String(simulationId))
      .then((res) => res.data)
  )

  return { surveyData: data, isLoadingSurvey, errorSurvey, mutateSurvey }
}
