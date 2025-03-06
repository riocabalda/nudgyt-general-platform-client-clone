'use client'

import { PropsWithChildren } from 'react'
import organizationConfig from '../../config/organizationConfig'
import useOrganization from '../../hooks/useOrganization'
import useUser from '../../hooks/useUser'
import { roles } from '../../services/userService'
import Forbidden from '../Forbidden'

function RequirePublicAdmin(props: PropsWithChildren) {
  const { children } = props

  const { user, isLoadingUser } = useUser()
  const { membership } = useOrganization()

  const isSuperAdmin = user?.is_super_admin ?? false

  const orgName = membership?.organization.name
  const isPublicMember = orgName === organizationConfig.PUBLIC_ORGANIZATION_NAME
  const isAdmin = membership?.roles.includes(roles.admin) ?? false
  const isPublicAdmin = isPublicMember && isAdmin

  const isValidUser = isSuperAdmin || isPublicAdmin

  if (isLoadingUser) {
    return null
  }

  if (!isValidUser) {
    return <Forbidden />
  }

  return children
}

export default RequirePublicAdmin
