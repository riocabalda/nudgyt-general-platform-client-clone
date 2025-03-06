'use client'

import userService from '@/app/(shared)/services/admin/userService'
import { useSearchParams } from 'next/navigation'
import useSWRInfinite from 'swr/infinite'
import usePageParams from './usePageParams'

type PaginatedUserResponse = Awaited<
  ReturnType<typeof userService.getUsers>
>['data']

function useGetOrganizationUsersInfinite() {
  const searchParams = useSearchParams()
  const { viewedOrgSlug } = usePageParams()

  function getKey(
    pageIndex: number,
    previousPageData: PaginatedUserResponse | null
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
    return ['/admin/users', viewedOrgSlug, query.toString()]
  }

  const swrInfinite = useSWRInfinite(
    getKey,
    ([, slug, queryString]: NonNullable<ReturnType<typeof getKey>>) =>
      userService.getUsers(slug, queryString).then((res) => res.data),
    { keepPreviousData: true }
  )

  const { data } = swrInfinite

  const usersData = data && data.flatMap((page) => page.data)
  const isTotalUsers = data?.at(-1)?.total === usersData?.length

  return {
    swrInfinite,
    usersData,
    isTotalUsers
  }
}

export default useGetOrganizationUsersInfinite
