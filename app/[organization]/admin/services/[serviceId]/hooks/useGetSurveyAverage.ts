import useSWR from 'swr'
import simulationService from '@/app/(shared)/services/admin/simulationService'

function useGetSurveyAverage(orgSlug: string, serviceId: string) {
  const { data, isLoading, error } = useSWR(
    `/${orgSlug}/admin/surveys/average?service_id=${serviceId}`,
    () =>
      simulationService
        .getSurveyAverage(orgSlug, serviceId)
        .then((res) => res.data)
  )

  return { averageRating: data?.data, isLoading, error }
}

export default useGetSurveyAverage
