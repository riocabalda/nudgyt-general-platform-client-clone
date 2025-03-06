import useGetOrganization from '@/app/(shared)/hooks/useGetOrganization'
import usePageParams from './usePageParams'

function useOrganizationName() {
  const { viewedOrgSlug } = usePageParams()
  const { data: organization } = useGetOrganization(viewedOrgSlug)

  const orgName = organization?.name

  return orgName
}

export default useOrganizationName
