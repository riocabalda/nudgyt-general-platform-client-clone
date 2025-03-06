import useSWR from 'swr'
import userService from '../services/admin/userService'

function useGetUser(orgSlug: string, userId: string) {
  const swr = useSWR(['/admin/users', orgSlug, userId], ([, slug, id]) =>
    userService.getUserById(slug, id).then((res) => res.data.data)
  )

  return swr
}

export default useGetUser
