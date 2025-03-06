import useSWR from 'swr'
import organizationService from '@/app/(shared)/services/admin/organizationService'

export function useGetOrganizationLearnersCount(
  orgSlug: string,
  targetOrgSlug?: string
) {
  const shouldFetch = orgSlug && targetOrgSlug

  const { data, isLoading, error, mutate } = useSWR(
    shouldFetch
      ? `/${orgSlug}/admin/organizations/${targetOrgSlug}/learners-count`
      : null,
    () =>
      organizationService
        .getOrgLearnersCount(orgSlug, targetOrgSlug!)
        .then((res) => res.data)
  )

  return { data, isLoading, error, mutate }
}
