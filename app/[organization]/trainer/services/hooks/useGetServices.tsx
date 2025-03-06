import useSWR from 'swr'
import serviceService from '@/app/(shared)/services/trainer/serviceService'

function useGetServices(orgSlug: string, searchParams: string) {
  const { data, isLoading, error, mutate } = useSWR(
    `/${orgSlug}/trainer/services?${searchParams.toString()}`,
    () =>
      serviceService
        .getServices(orgSlug, searchParams.toString())
        .then((res) => res.data)
  )
  return { data, error, isLoading, mutate }
}
export default useGetServices
