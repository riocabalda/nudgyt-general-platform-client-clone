import useOrganization from '@/app/(shared)/hooks/useOrganization'
import organizationService from '@/app/(shared)/services/admin/organizationService'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'

function useGetEnterprises() {
  const searchParams = useSearchParams()
  const { orgSlug } = useOrganization()

  const query = new URLSearchParams(searchParams)

  const fetch = useSWR(
    ['/admin/organizations/enterprises', orgSlug, query.toString()],
    ([, slug, queryString]) =>
      organizationService
        .getEnterprises(slug, queryString)
        .then((res) => res.data),
    { keepPreviousData: true }
  )

  return fetch
}

export default useGetEnterprises
