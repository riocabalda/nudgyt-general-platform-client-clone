import useSWR from 'swr'
import organizationService from '@/app/(shared)/services/admin/organizationService'

export function useGetOrganizationBySlug(
  orgSlug: string,
  targetOrgSlug?: string
) {
  const shouldFetch = orgSlug && targetOrgSlug

  const { data, isLoading, error, mutate } = useSWR(
    shouldFetch ? `/${orgSlug}/admin/organizations/${targetOrgSlug}` : null,
    () =>
      organizationService
        .getOrganizationBySlug(orgSlug, targetOrgSlug!)
        .then((res) => res.data)
  )

  return { data, isLoading, error, mutate }
}
