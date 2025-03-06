import organizationConfig from '../config/organizationConfig'
import { roles } from '../services/userService'
import useOrganization from './useOrganization'

function useIsUserPublicAdmin() {
  const { membership } = useOrganization()

  const orgName = membership?.organization.name
  const isPublicMember = orgName === organizationConfig.PUBLIC_ORGANIZATION_NAME

  const isAdmin = membership?.roles.includes(roles.admin) ?? false

  const isUserPublicAdmin = isPublicMember && isAdmin

  return { isUserPublicAdmin }
}

export default useIsUserPublicAdmin
