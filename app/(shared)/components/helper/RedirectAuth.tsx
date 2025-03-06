'use client'

import { redirect } from 'next/navigation'
import { PropsWithChildren, useLayoutEffect, useState } from 'react'
import authService from '../../services/authService'
import { User, roles } from '../../services/userService'

function RedirectAuth({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User>()

  const firstMembership = user?.organizations?.[0]
  const firstOrgSlug = firstMembership?.organization.slug
  const firstRole = firstMembership?.roles[0]

  useLayoutEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        const { data: user } = await authService.getAuthUser()
        setUser(user.data)
        setIsLoading(false)
      } catch (error: any) {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [])

  useLayoutEffect(() => {
    if (firstRole === roles.learner)
      return redirect(encodeURI(`/${firstOrgSlug}/learner/dashboard`))
    if (firstRole === roles.trainer)
      return redirect(encodeURI(`/${firstOrgSlug}/trainer/dashboard`))
    if (firstRole === roles.admin || firstRole === roles.superadmin)
      return redirect(encodeURI(`/${firstOrgSlug}/admin/dashboard`))
  }, [user, firstRole])

  if (isLoading) {
    return null
  }

  return children
}

export default RedirectAuth
