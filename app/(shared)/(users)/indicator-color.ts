import { OrganizationStatus } from '../services/admin/organizationService'

export const UserIndicatorColor = {
  Pending: '#CBCDD0',
  Declined: '#ee2f56',

  Approved: '#80D1AC',
  Verified: '#5E7AAD',
  Unverified: '#CBCDD0',
  Archived: '#ee2f56',
  Blocked: '#393C3F'
}

export const OrganizationIndicatorColor: Record<OrganizationStatus, string> = {
  [OrganizationStatus.Active]: '#80D1AC',
  [OrganizationStatus.Inactive]: '#CBCDD0',
  [OrganizationStatus.Suspended]: '#393C3F'
}
