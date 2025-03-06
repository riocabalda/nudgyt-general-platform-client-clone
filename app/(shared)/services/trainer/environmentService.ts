import { Environment, WithPagination, ApiResponse } from '../../types'
import apiClient from '../apiClient'

const getEnvironments = (orgSlug: string) =>
  apiClient.get<WithPagination<Environment[]>>(
    `/${orgSlug}/trainer/environments`
  )

const getEnvironmentById = (orgSlug: string, environmentId: string) =>
  apiClient.get<ApiResponse<Environment>>(
    `/${orgSlug}/trainer/environments/${environmentId}`
  )

const environmentService = {
  getEnvironments,
  getEnvironmentById
}
export default environmentService
