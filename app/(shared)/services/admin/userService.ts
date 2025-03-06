import { Access, ApiResponse, WithPagination } from '../../types'
import apiClient from '../apiClient'
import { User } from '../userService'

export type PaginatedUser = Omit<User, 'verification_token'> & {
  services?: number | null
}

export type LearnerStat = {
  fullName: string
  email: string
  joinedDate: string
  usageHours: number
  services: string[]
  recentUsedService: string
}

export type GetLearnerStats = {
  from: number
  to: number
  total: number
  current_page: number
  prev_page?: string
  next_page?: string
  data: LearnerStat[]
}
interface BulkUserActionRequest {
  userIds: string[]
  transfer_to_user_id?: string
}

const getUsers = (orgSlug: string, queryString?: string) =>
  apiClient.get<WithPagination<PaginatedUser[]>>(
    `/${orgSlug}/admin/users?${queryString}`
  )

const getUsersByOrgSlug = (
  userOrgSlug: string,
  orgSlug: string,
  queryString?: string
) =>
  apiClient.get<{
    data: User[]
    from: number
    to: number
    total: number
    prev_page: string
    next_page: string
    current_page: number
  }>(`/${userOrgSlug}/admin/users/organization/${orgSlug}?${queryString}`)

const getTrainers = (orgSlug: string, queryString?: string) =>
  apiClient.get<{
    data: User[]
    from: number
    to: number
    total: number
    prev_page: string
    next_page: string
    current_page: number
  }>(`/${orgSlug}/admin/users/trainers?${queryString}`)

const getLearners = (orgSlug: string, queryString?: string) =>
  apiClient.get<{
    data: User[]
    from: number
    to: number
    total: number
    prev_page: string
    next_page: string
    current_page: number
  }>(`/${orgSlug}/admin/users/learners?${queryString}`)

const getUserById = (orgSlug: string, userId: string) =>
  apiClient.get<ApiResponse<User | null>>(`/${orgSlug}/admin/users/${userId}`)

const sendRegistrationLink = (
  orgSlug: string,
  body: { email: string; role: string; organization: string }
) => apiClient.post(`/${orgSlug}/admin/users/invite`, body)

const inviteOwnerBasic = (orgSlug: string, formData: any) =>
  apiClient.post(`/${orgSlug}/admin/users/invite/owner/basic`, formData)

const inviteOwnerEnterprise = (orgSlug: string, formData: any) =>
  apiClient.post(`/${orgSlug}/admin/users/invite/owner/enterprise`, formData)

const blockUser = (orgSlug: string, userId: string) =>
  apiClient.patch(`/${orgSlug}/admin/users/${userId}/block`)

const unblockUser = (orgSlug: string, userId: string) =>
  apiClient.patch(`/${orgSlug}/admin/users/${userId}/unblock`)

const archiveUser = (
  orgSlug: string,
  userId: string,
  formData?: { transfer_to_user_id: string }
) => apiClient.patch(`/${orgSlug}/admin/users/${userId}/archive`, formData)

const approveUser = (orgSlug: string, userId: string) =>
  apiClient.patch(`/${orgSlug}/admin/users/${userId}/approve`)

const bulkApproveUsers = (orgSlug: string, data: BulkUserActionRequest) =>
  apiClient.post<ApiResponse<null>>(
    `/${orgSlug}/admin/users/bulk-approve`,
    data
  )

const bulkBlockUsers = (orgSlug: string, data: BulkUserActionRequest) =>
  apiClient.post<ApiResponse<null>>(`/${orgSlug}/admin/users/bulk-block`, data)

const bulkUnblockUsers = (orgSlug: string, data: BulkUserActionRequest) =>
  apiClient.post<ApiResponse<null>>(
    `/${orgSlug}/admin/users/bulk-unblock`,
    data
  )

const bulkArchiveUsers = (orgSlug: string, data: BulkUserActionRequest) =>
  apiClient.post<ApiResponse<null>>(
    `/${orgSlug}/admin/users/bulk-archive`,
    data
  )

const getLearnerExperience = (userId: string, orgSlug: string) =>
  apiClient.get(`/${orgSlug}/admin/users/${userId}/learner-experience`)

const getUserRecentServices = (userId: string, orgSlug: string) =>
  apiClient.get<any>(`/${orgSlug}/admin/users/${userId}/recent-services`)

const getAccess = (orgSlug: string) =>
  apiClient.get<ApiResponse<Access>>(`/${orgSlug}/admin/users/accounts/access`)

const getLearnerStats = (orgSlug: string, queryString?: string) =>
  apiClient.get<ApiResponse<GetLearnerStats>>(
    `/${orgSlug}/admin/users/stats${queryString ? `?${queryString}` : ''}`
  )

const userService = {
  getUsers,
  getUsersByOrgSlug,
  getTrainers,
  getLearners,
  getUserById,
  sendRegistrationLink,
  inviteOwnerBasic,
  inviteOwnerEnterprise,
  blockUser,
  unblockUser,
  archiveUser,
  approveUser,
  bulkApproveUsers,
  bulkBlockUsers,
  bulkUnblockUsers,
  bulkArchiveUsers,
  getLearnerExperience,
  getUserRecentServices,
  getAccess,
  getLearnerStats
}

export default userService
