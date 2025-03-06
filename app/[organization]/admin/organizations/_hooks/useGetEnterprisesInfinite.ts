'use client'

import useOrganization from '@/app/(shared)/hooks/useOrganization'
import organizationService from '@/app/(shared)/services/admin/organizationService'
import { useSearchParams } from 'next/navigation'
import useSWRInfinite from 'swr/infinite'

type PaginatedEnterprisesResponse = Awaited<
  ReturnType<typeof organizationService.getEnterprises>
>['data']

function useGetEnterprisesInfinite() {
  const searchParams = useSearchParams()
  const { orgSlug } = useOrganization()

  function getKey(
    pageIndex: number,
    previousPageData: PaginatedEnterprisesResponse | null
  ) {
    // If we reach the end, return null
    if (previousPageData && !previousPageData.next_page) {
      return null
    }

    // Build query string dynamically
    const nextPageIndex = pageIndex + 1

    const query = new URLSearchParams(searchParams)
    query.set('page', nextPageIndex.toString())

    // Return the key for the next page
    return ['/admin/organizations/enterprises', orgSlug, query.toString()]
  }

  const swrInfinite = useSWRInfinite(
    getKey,
    ([, slug, queryString]: NonNullable<ReturnType<typeof getKey>>) =>
      organizationService
        .getEnterprises(slug, queryString)
        .then((res) => res.data),
    { keepPreviousData: true }
  )

  const { data } = swrInfinite

  const enterprises = data?.flatMap((page) => page.data) ?? []
  const isTotalEnterprises = data?.at(-1)?.total === enterprises.length

  return {
    swrInfinite,
    enterprises,
    isTotalEnterprises
  }
}

export default useGetEnterprisesInfinite
