import useSWR from 'swr'
import simulationService from '@/app/(shared)/services/trainer/simulationService'

export function useGetSimulation(orgSlug: string, simulationId: string) {
  const { data, isLoading, error, mutate, isValidating } = useSWR(
    `/${orgSlug}/trainer/simulations/${simulationId}`,
    () =>
      simulationService
        .getSimulation(orgSlug, String(simulationId))
        .then((res) => res.data)
  )

  return { simulationData: data?.data, isLoading, error, isValidating, mutate }
}
