import useSWR from 'swr'
import serviceService from '@/app/(shared)/services/learner/serviceService'

export function useGetService(orgSlug: string, id: string) {
  const { data, isLoading, error, isValidating, mutate } = useSWR(
    `/${orgSlug}/learner/services/${id}`,
    () => serviceService.getService(orgSlug, id).then((res) => res.data)
  )

  return { serviceData: data?.data, isLoading, error, isValidating, mutate }
}
