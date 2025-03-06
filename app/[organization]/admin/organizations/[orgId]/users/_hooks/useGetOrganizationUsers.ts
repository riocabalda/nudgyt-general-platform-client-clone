'use client'

import userService from '@/app/(shared)/services/admin/userService'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import usePageParams from './usePageParams'

function useGetOrganizationUsers() {
  const searchParams = useSearchParams()
  const { viewedOrgSlug } = usePageParams()

  const query = new URLSearchParams(searchParams)

  const fetch = useSWR(
    ['/admin/users', viewedOrgSlug, query.toString()],
    ([, slug, queryString]) =>
      userService.getUsers(slug, queryString).then((res) => res.data),
    { keepPreviousData: true }
  )

  return fetch
}

export default useGetOrganizationUsers
