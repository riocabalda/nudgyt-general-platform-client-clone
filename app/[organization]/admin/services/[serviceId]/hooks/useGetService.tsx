import serviceService from '@/app/(shared)/services/admin/serviceService'
import useSWR from 'swr'

function useGetService(orgSlug: string, serviceId: string) {
  const { data, isLoading, error, mutate } = useSWR(
    `/admin/cases/${serviceId}`,
    () =>
      serviceService
        .getService(orgSlug, String(serviceId))
        .then((res) => res.data)
  )
  return { serviceData: data?.data, error, isLoading, mutate }
}
export default useGetService
