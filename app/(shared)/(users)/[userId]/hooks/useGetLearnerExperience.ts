import userService from '@/app/(shared)/services/admin/userService'
import useSWR from 'swr'

function useGetLearnerExperience(orgSlug: string, userId: string) {
  const swr = useSWR(
    ['/admin/users/learner-experience', orgSlug, userId],
    ([, slug, id]) =>
      userService.getLearnerExperience(id, slug).then((res) => res.data)
  )

  return swr
}

export default useGetLearnerExperience
