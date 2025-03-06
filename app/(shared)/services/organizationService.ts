import { ApiResponse, Organization, OrganizationDisplay } from '../types'
import { convertObjectToFormData } from '../utils'
import apiClient from './apiClient'

const getOrganization = (orgSlug: string) =>
  apiClient.get<ApiResponse<OrganizationDisplay>>(`/${orgSlug}`)

const updateOrganization = (
  orgSlug: string,
  body: { name?: string; logo?: File }
) =>
  apiClient.patch<ApiResponse<Organization>>(
    `/${orgSlug}`,
    convertObjectToFormData(body)
  )

const updateInvitation = (
  orgSlug: string,
  membershipId: string,
  params: {
    action: 'accept' | 'decline'
  }
) =>
  apiClient.patch(
    `${orgSlug}/invitations/${membershipId}?${new URLSearchParams(params)}`
  )

const updateOwnerInvitation = (
  orgSlug: string,
  pendingOrgId: string,
  params: {
    action: 'accept' | 'decline'
    organizationName: string
  }
) =>
  apiClient.patch<ApiResponse<Organization | null>>(
    `${orgSlug}/invitations/owners/${pendingOrgId}?${new URLSearchParams(params)}`
  )

const organizationService = {
  getOrganization,
  updateOrganization,
  updateInvitation,
  updateOwnerInvitation
}

export default organizationService
