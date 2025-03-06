import { ApiResponse, Organization, WithPagination } from '../../types'
import apiClient from '../apiClient'

export enum OrganizationStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Suspended = 'Suspended'
}

export type OrganizationUser = {
  _id: string
  name: string
  status: OrganizationStatus
  suspended_at: string
  created_at: string
  owner: string
  members: number
  slug: string
}

export type EnterpriseUser = {
  _id: string
  organization_name: string
  email: string
  platform_url: string
  monthly_amount: number
  user_seats: number
  status: OrganizationStatus

  created_at: string
}

interface BulkUpdateOrganizationRequest {
  organizationIds: string[]
  status: OrganizationStatus
}

const getOrganizations = (orgSlug: string, queryString?: string) =>
  apiClient.get<WithPagination<OrganizationUser[]>>(
    `/${orgSlug}/admin/organizations?${queryString}`
  )

const getEnterprises = (orgSlug: string, queryString?: string) =>
  apiClient.get<WithPagination<EnterpriseUser[]>>(
    `/${orgSlug}/admin/organizations/enterprises?${queryString}`
  )

const getSuperAdminOrganizations = (orgSlug: string) =>
  apiClient.get<WithPagination<OrganizationUser[]>>(
    `/${orgSlug}/admin/organizations/super-admin`
  )

const updateOrganization = (
  orgSlug: string,
  orgId: string,
  body: { status: OrganizationStatus }
) => apiClient.patch(`/${orgSlug}/admin/organizations/${orgId}`, body)

const updateEnterprise = (
  orgSlug: string,
  orgId: string,
  body: { status: OrganizationStatus }
) =>
  apiClient.patch(`/${orgSlug}/admin/organizations/enterprises/${orgId}`, body)

const bulkUpdateOrganizations = (
  orgSlug: string,
  data: BulkUpdateOrganizationRequest
) =>
  apiClient.post<
    ApiResponse<{
      modifiedCount: number
      organizations: OrganizationUser[]
    }>
  >(`/${orgSlug}/admin/organizations/bulk-update-status`, data)

const addOrgExtraLearners = (
  orgSlug: string,
  targetOrgSlug: string,
  data: { extraLearners: number }
) =>
  apiClient.patch(
    `/${orgSlug}/admin/organizations/${targetOrgSlug}/add-extra-learners`,
    data
  )

const getOrganizationBySlug = (orgSlug: string, targetOrgSlug: string) =>
  apiClient.get<ApiResponse<OrganizationUser & { subscription: any }>>(
    `/${orgSlug}/admin/organizations/${targetOrgSlug}`
  )

const bulkUpdateEnterprises = (
  orgSlug: string,
  data: {
    enterpriseIds: string[]
    status: OrganizationStatus
  }
) =>
  apiClient.post<never>(
    `/${orgSlug}/admin/organizations/enterprises/bulk-update-status`,
    data
  )

const acceptPendingOrganization = (
  orgSlug: string,
  body: {
    pendingOrgId: string
    organizationName: string
  }
) =>
  apiClient.post<ApiResponse<Organization>>(
    `/${orgSlug}/admin/organizations/pending/accept`,
    body
  )

const declinePendingOrganization = (
  orgSlug: string,
  body: {
    pendingOrgId: string
  }
) =>
  apiClient.post<ApiResponse<Organization>>(
    `/${orgSlug}/admin/organizations/pending/decline`,
    body
  )

const getOrgLearnersCount = (orgSlug: string, targetOrgSlug: string) =>
  apiClient.get<ApiResponse<number>>(
    `/${orgSlug}/admin/organizations/${targetOrgSlug}/learners-count`
  )

const organizationService = {
  getOrganizations,
  getEnterprises,
  updateOrganization,
  updateEnterprise,
  bulkUpdateOrganizations,
  addOrgExtraLearners,
  getOrganizationBySlug,
  bulkUpdateEnterprises,
  acceptPendingOrganization,
  declinePendingOrganization,
  getSuperAdminOrganizations,
  getOrgLearnersCount
}

export default organizationService
