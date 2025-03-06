import simulationService from '@/app/(shared)/services/admin/simulationService'
import useSWR from 'swr'

function useGetSimulationsPreviousAttempt(
  orgSlug: string,
  queryString: string
) {
  const endpoint = `/${orgSlug}/admin/simulations/previous-attempts?${queryString}`
  const { data, isLoading, error, mutate } = useSWR(endpoint, () =>
    simulationService
      .getPreviousAttemptSimulations(orgSlug, queryString)
      .then((res) => res.data)
  )

  return { data, isLoading, error, mutate }
}

export default useGetSimulationsPreviousAttempt
