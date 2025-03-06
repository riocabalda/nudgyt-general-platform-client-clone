import useSWR from 'swr'
import simulationService from '@/app/(shared)/services/trainer/simulationService'

function useGetSurveyAverage(orgSlug: string, serviceId: string) {
  const { data, isLoading, error } = useSWR(
    `/${orgSlug}/trainer/surveys/average?service_id=${serviceId}`,
    () =>
      simulationService
        .getSurveyAverage(orgSlug, serviceId)
        .then((res) => res.data)
  )

  return { averageRating: data?.data, isLoading, error }
}

export default useGetSurveyAverage
