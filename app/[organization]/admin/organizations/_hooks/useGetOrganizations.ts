'use client'

import useOrganization from '@/app/(shared)/hooks/useOrganization'
import organizationService from '@/app/(shared)/services/admin/organizationService'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'

function useGetOrganizations() {
  const searchParams = useSearchParams()
  const { orgSlug } = useOrganization()

  const query = new URLSearchParams(searchParams)

  const fetch = useSWR(
    ['/admin/organizations', orgSlug, query.toString()],
    ([, slug, queryString]) =>
      organizationService
        .getOrganizations(slug, queryString)
        .then((res) => res.data),
    { keepPreviousData: true }
  )

  return fetch
}

export default useGetOrganizations
