'use client'

import useOrganization from '@/app/(shared)/hooks/useOrganization'
import logService from '@/app/(shared)/services/admin/log.service'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'

const useGetLogs = () => {
  const searchParams = useSearchParams()
  const { orgSlug } = useOrganization()

  const queryString = searchParams.toString()

  const { data, error, isLoading, mutate } = useSWR(
    `${orgSlug}/admin/logs?${queryString}`,
    () =>
      logService.getActivityLogs(orgSlug, queryString).then((res) => res.data),
    { keepPreviousData: true }
  )

  return { data, error, isLoading, mutate }
}

export default useGetLogs
