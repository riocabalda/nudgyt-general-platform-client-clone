import templateService from '@/app/(shared)/services/admin/templateService'
import useSWR from 'swr'

function useGetSharedTemplates(orgSlug: string) {
  const { data, isLoading, error, mutate } = useSWR(
    `${orgSlug}/admin/templates/shared`,
    () =>
      templateService
        .getSharedTemplates(String(orgSlug))
        .then((res) => res.data)
  )
  return { data, error, isLoading, mutate }
}

export default useGetSharedTemplates
