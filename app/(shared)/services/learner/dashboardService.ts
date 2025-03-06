import { ApiResponse } from '../../types'
import apiClient from '../apiClient'

export type PopularService = {
  serviceId: string // MongoDB ObjectId
  title: string
  description: string
  cover_image: string
  creator: string
  simulationCount: number
  lastSimulation: Date
  character: {
    avatar: string
    name: string
    languages: string[]
  }
  environment: {
    image: string
    location: string
    description: string
  }
}

const getExperience = (orgSlug: string) =>
  apiClient.get<ApiResponse<any>>(`/${orgSlug}/learner/users/experience`) // Temporary API call to get experience

const getMostPopularServices = ({
  page,
  pageSize,
  orgSlug
}: {
  page: number
  pageSize: number
  orgSlug: string
}) =>
  apiClient.get<ApiResponse<PopularService[]>>(
    `/${orgSlug}/learner/services/most-popular?page=${page}&pageSize=${pageSize}`
  )

const dashboardService = {
  getExperience,
  getMostPopularServices
}

export default dashboardService
