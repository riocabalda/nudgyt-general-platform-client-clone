import { roles } from '../services/userService'
import {
  endUserPermissions,
  adminProfilePermissions,
  endUserTxnPermissions
} from './permissionsList'

const permissions = {
  [roles.superadmin]: [
    endUserPermissions.resendVerifEmail,
    endUserPermissions.updateInfo,
    endUserPermissions.updateSecondaryEmail,

    adminProfilePermissions.updateEmail,

    endUserTxnPermissions.reactivateVoucher
  ],
  [roles.admin]: [
    endUserPermissions.resendVerifEmail,
    endUserPermissions.updateInfo,
    endUserPermissions.updateSecondaryEmail,

    adminProfilePermissions.updateEmail,

    endUserTxnPermissions.reactivateVoucher
  ]
}

export const can = (role: string, requiredPermission: string) =>
  permissions[role].includes(requiredPermission)

export default permissions
