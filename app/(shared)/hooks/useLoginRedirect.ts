'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import authTokenService from '../services/authTokenService'
import { roles, User } from '../services/userService'

function useLoginRedirect() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const redirectPath = searchParams.get('redirect')

  function loginRedirect(user: User, token: string) {
    authTokenService.setAccessToken(token)

    const firstMembership = user?.organizations?.[0]
    const firstOrgSlug = firstMembership?.organization.slug
    const firstRole = firstMembership?.roles[0]

    if (firstOrgSlug === undefined) {
      throw new Error('Organization name not available')
    }

    if (redirectPath !== null) {
      router.replace(redirectPath)
    } else if (firstRole === roles.learner) {
      router.replace(encodeURI(`/${firstOrgSlug}/learner/dashboard`))
    } else if (firstRole === roles.trainer) {
      router.replace(encodeURI(`/${firstOrgSlug}/trainer/dashboard`))
    } else if (firstRole === roles.admin || firstRole === roles.superadmin) {
      router.replace(encodeURI(`/${firstOrgSlug}/admin/dashboard`))
    }
  }

  return { loginRedirect }
}

export default useLoginRedirect
