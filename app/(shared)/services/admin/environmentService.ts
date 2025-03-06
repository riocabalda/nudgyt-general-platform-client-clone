import { Environment, WithPagination, ApiResponse } from '@/app/(shared)/types'
import apiClient from '../apiClient'

const getEnvironments = (orgSlug: string) =>
  apiClient.get<WithPagination<Environment[]>>(`/${orgSlug}/admin/environments`)

const getEnvironmentById = (orgSlug: string, environmentId: string | null) =>
  apiClient.get<ApiResponse<Environment>>(
    `/${orgSlug}/admin/environments/${environmentId}`
  )

const environmentService = {
  getEnvironments,
  getEnvironmentById
}

export default environmentService
