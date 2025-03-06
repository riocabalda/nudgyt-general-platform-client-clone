import organizationService from '@/app/(shared)/services/admin/organizationService'
import useSWR from 'swr'

function useGetOrganizations(orgSlug: string) {
  const { data, isLoading, error, mutate } = useSWR(
    `${orgSlug}/admin/organizations/super-admin`,
    () =>
      organizationService
        .getSuperAdminOrganizations(String(orgSlug))
        .then((res) => res.data)
  )
  return { data, error, isLoading, mutate }
}
export default useGetOrganizations
