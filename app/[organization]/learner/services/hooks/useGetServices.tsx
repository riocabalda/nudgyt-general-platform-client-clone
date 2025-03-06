import useSWR from 'swr'
import serviceService from '@/app/(shared)/services/learner/serviceService'

export function useGetServices(orgSlug: string, searchParam?: string) {
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    `/${orgSlug}/learner/services?${searchParam}`,
    () =>
      serviceService.getServices(orgSlug, searchParam).then((res) => res.data)
  )

  return { data, isLoading, error, isValidating, mutate }
}
