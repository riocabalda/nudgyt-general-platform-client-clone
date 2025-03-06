import userService from '@/app/(shared)/services/admin/userService'
import useSWR from 'swr'

function useGetRecentServices(orgSlug: string, userId: string) {
  const swr = useSWR(
    ['/admin/users/recent-services', orgSlug, userId],
    ([, slug, id]) =>
      userService.getUserRecentServices(id, slug).then((res) => res.data)
  )

  return swr
}

export default useGetRecentServices
