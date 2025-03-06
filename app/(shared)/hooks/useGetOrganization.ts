import useSWR from 'swr'
import organizationService from '../services/organizationService'
import useOrganization from './useOrganization'

function useGetOrganization(givenOrgSlug?: string) {
  const { orgSlug: urlOrgSlug } = useOrganization()
  const orgSlug = givenOrgSlug ?? urlOrgSlug

  const swr = useSWR([orgSlug], ([slug]) =>
    organizationService.getOrganization(slug).then((res) => res.data.data)
  )

  return swr
}

export default useGetOrganization
