'use client'

import { invitationStatus } from '../services/userService'
import useUser from './useUser'

function useInvitations() {
  const { user } = useUser()

  const memberships = user?.organizations ?? []
  const invitations = memberships.filter(
    (membership) => membership.status !== invitationStatus.ACCEPTED
  )

  const pendingOrganizations = user?.pending_organizations ?? []

  const hasInvitations =
    invitations.length !== 0 || pendingOrganizations.length !== 0

  return {
    hasInvitations,
    ...{ invitations, pendingOrganizations }
  }
}

export default useInvitations
