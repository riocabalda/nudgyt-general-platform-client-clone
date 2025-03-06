import { Access, ApiResponse } from '../../types'
import apiClient from '../apiClient'

const getAccess = (orgSlug: string) =>
  apiClient.get<ApiResponse<Access>>(
    `/${orgSlug}/trainer/users/accounts/access`
  )

const userService = {
  getAccess
}

export default userService
