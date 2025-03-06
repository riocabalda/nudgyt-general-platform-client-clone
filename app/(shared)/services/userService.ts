import { Organization } from '../types'
import apiClient from './apiClient'

export type PendingOrganization = {
  _id: string
  name: string
}
export type OrganizationMembership = {
  _id: string
  organization: Organization
  roles: string[]
  is_owner: boolean

  status: string

  approved_at?: string | null
  blocked_at?: string | null

  created_at: string
  updated_at: string
}

export type User = {
  _id: string
  full_name: string
  email: string
  contact: string
  is_super_admin?: boolean | null
  organizations?: OrganizationMembership[] | null
  pending_organizations?: PendingOrganization[] | null
  created_at: string
  archived_at: string
  email_verified_at: string
  last_logged_in_at: string | null
  deleted_at: string
  trainings_count: number
  subscriptions_count: number
  subscriptions_with_active_courses_count: number
}

export const roles = {
  superadmin: 'Super Admin',
  admin: 'Admin',
  trainer: 'Trainer',
  learner: 'Learner'
}
export const invitationStatus = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  DECLINED: 'Declined'
} as const

const resendVerificationEmail = (formData: { email: string }) =>
  apiClient.post('/auth/resend-email-verification', formData)

const forgotPassword = (formData: { email: string }) =>
  apiClient.post('/auth/forgot-password', formData)

const verifyEmail = (formData: { verificationToken: string }) =>
  apiClient.post('/auth/verify-email', {
    verification_token: formData.verificationToken
  })

const resetPassword = (formData: {
  token: string
  email: string
  password: string
  confirmPassword: string
}) =>
  apiClient.patch('/auth/reset-password', {
    token: formData.token,
    email: formData.email,
    password: formData.password,
    confirm_password: formData.confirmPassword
  })

const userService = {
  resendVerificationEmail,
  forgotPassword,
  verifyEmail,
  resetPassword
}

export default userService
