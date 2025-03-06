'use client'

import { usePathname, useRouter } from 'next/navigation'
import { PropsWithChildren, useEffect, useState } from 'react'
import useOrganization from '../../hooks/useOrganization'
import authService from '../../services/authService'
import authTokenService from '../../services/authTokenService'
import { invitationStatus, User } from '../../services/userService'
import Forbidden from '../Forbidden'
import MainSkeleton from '../MainSkeleton'

function RequireAuth({
  role,
  shouldBeOrgOwner,
  children
}: PropsWithChildren<{ role: string[]; shouldBeOrgOwner?: boolean }>) {
  const { orgSlug } = useOrganization()
  const router = useRouter()
  const pathname = usePathname()

  const [isUserLoading, setIsUserLoading] = useState(true)
  const [user, setUser] = useState<User>()
  useEffect(() => {
    const fetchUser = async () => {
      setIsUserLoading(true)
      try {
        const { data: user } = await authService.getAuthUser()
        setUser(user.data)
        setIsUserLoading(false)
      } catch (error: any) {
        setIsUserLoading(false)
      }
    }
    fetchUser()
  }, [])

  // Sign out event listener
  useEffect(() => {
    const handleSignOut = () => {
      authTokenService.removeTokens()

      const params = {
        redirect: pathname
      }
      router.replace(`/sign-in?${new URLSearchParams(params)}`)
    }
    window.addEventListener('user:signout', handleSignOut)
    return () => window.removeEventListener('user:signout', handleSignOut)
  }, [])

  const isLoading = isUserLoading
  if (isLoading) return <MainSkeleton />

  const orgMembership = user?.organizations?.find(
    (membership) => membership.organization.slug === orgSlug
  )

  const isOrgMember = orgMembership !== undefined
  const isMembershipAccepted =
    orgMembership?.status === invitationStatus.ACCEPTED

  const orgRoles = orgMembership?.roles ?? []
  const isOrgRoleAllowed = role.some((allowedRole) =>
    orgRoles.includes(allowedRole)
  )
  const isForOwner = shouldBeOrgOwner ? orgMembership?.is_owner : true
  const isAllowed =
    isOrgMember && isOrgRoleAllowed && isMembershipAccepted && isForOwner
  if (!isAllowed) {
    return <Forbidden />
  }

  return children
}

export default RequireAuth
