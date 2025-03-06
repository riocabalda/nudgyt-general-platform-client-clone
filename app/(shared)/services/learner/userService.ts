import { Access, ApiResponse } from '../../types'
import apiClient from '../apiClient'
import { User } from '../userService'

type GuestUserType = {
  id: number
  user_id: string
  simulation_id: string
  guest_token: string
  user: User
}

const getGuestUser = (token: string) =>
  apiClient.get<GuestUserType>(`/guest/token/${token}`)

const getAccess = (orgSlug: string) =>
  apiClient.get<ApiResponse<Access>>(
    `/${orgSlug}/learner/users/accounts/access`
  )

const userService = {
  getGuestUser,
  getAccess
}

export default userService
