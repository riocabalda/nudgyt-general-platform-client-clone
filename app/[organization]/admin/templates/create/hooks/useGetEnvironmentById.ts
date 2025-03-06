import environmentService from '@/app/(shared)/services/admin/environmentService'
import useSWR from 'swr'

export function useGetEnvironmentById(
  orgSlug: string,
  environmentId: string | null
) {
  const { data, isLoading, error, mutate } = useSWR(
    orgSlug && environmentId
      ? `/${orgSlug}/admin/environments/${environmentId}`
      : null,
    () =>
      environmentService
        .getEnvironmentById(orgSlug ?? '', environmentId ?? '')
        .then((res) => res.data)
  )

  return { data, isLoading, error, mutate }
}
