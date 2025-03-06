import { roles } from '../services/userService'

const commonPages: string[] = []

const pagePermissions = {
  [roles.superadmin]: [
    '/admin/dashboard',
    '/admin/services',
    '/admin/subscriptions',
    '/admin/users',
    '/admin/account',
    '/admin/usage',
    '/admin/billing',
    '/admin/activity-logs',
    '/admin/settings/general',
    '/admin/templates',
    ...commonPages
  ],
  [roles.admin]: [
    '/admin/dashboard',
    '/admin/services',
    '/admin/subscriptions',
    '/admin/users',
    '/admin/account',
    '/admin/usage',
    '/admin/billing',
    '/admin/activity-logs',
    '/admin/settings/general',
    '/admin/templates',
    ...commonPages
  ],
  [roles.trainer]: [
    '/admin/dashboard',
    '/trainer/services',
    '/admin/account',
    ...commonPages
  ],
  [roles.learner]: [
    '/learner/dashboard',
    '/learner/services',
    '/learner/subscriptions',
    '/learner/account',
    ...commonPages
  ]
}

export const canView = (role: string, requiredPermission: string) =>
  pagePermissions[role].includes(requiredPermission)

export default pagePermissions
