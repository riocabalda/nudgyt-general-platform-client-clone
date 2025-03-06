'use client'

import useOrganization from '@/app/(shared)/hooks/useOrganization'
import organizationService from '@/app/(shared)/services/admin/organizationService'
import { useSearchParams } from 'next/navigation'
import useSWRInfinite from 'swr/infinite'

type PaginatedOrganizationResponse = Awaited<
  ReturnType<typeof organizationService.getOrganizations>
>['data']

function useGetOrganizationsInfinite() {
  const searchParams = useSearchParams()
  const { orgSlug } = useOrganization()

  function getKey(
    pageIndex: number,
    previousPageData: PaginatedOrganizationResponse | null
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
    return ['/admin/organizations', orgSlug, query.toString()]
  }

  const swrInfinite = useSWRInfinite(
    getKey,
    ([, slug, queryString]: NonNullable<ReturnType<typeof getKey>>) =>
      organizationService
        .getOrganizations(slug, queryString)
        .then((res) => res.data),
    { keepPreviousData: true }
  )

  const { data } = swrInfinite

  const organizationsData = data?.flatMap((page) => page.data) ?? []
  const isTotalOrganizations = data?.at(-1)?.total === organizationsData.length

  return {
    swrInfinite,
    organizationsData,
    isTotalOrganizations
  }
}

export default useGetOrganizationsInfinite
