import useSWR from 'swr'
import serviceService from '@/app/(shared)/services/trainer/serviceService'

function useGetLearnersScores(orgSlug: string, serviceId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    `/trainer/services/${serviceId}/learners-scores`,
    () =>
      serviceService
        .getServiceLearnersScores(orgSlug, String(serviceId))
        .then((res) => res.data)
  )
  return { learnersScores: data?.data, error, isLoading, mutate }
}
export default useGetLearnersScores
