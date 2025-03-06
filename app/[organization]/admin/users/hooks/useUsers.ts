'use client'

import userService from '@/app/(shared)/services/admin/userService'
import useSWR from 'swr'

const useUsers = (orgSlug: string, queryString?: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/${orgSlug}/admin/users?${queryString}`,
    () => userService.getUsers(orgSlug, queryString).then((res) => res.data),
    {
      keepPreviousData: true
    }
  )
  return { data, error, isLoading, mutate }
}

export default useUsers
