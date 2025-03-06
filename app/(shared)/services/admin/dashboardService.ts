import { ApiResponse } from '../../types'
import apiClient from '../apiClient'

export type DashboardStatistics = {
  trainers: { count: number; percentage: number }
  learners: { count: number; percentage: number }
  simulations: { count: number; percentage: number }
  courses: { count: number; percentage: number }
}

export type ServiceMetrics = {
  change: string
  isIncrease?: boolean
  label: string
  showTrend?: boolean
  value: string
}

export type ServicePopularity = {
  totalLearners: number
  service: string
}

const getDashboardStatistics = () =>
  apiClient.get<DashboardStatistics>(`/admin/dashboard/statistics`)

// Temporary simulation, type ANY is temporary
const getRecentServices = ({
  page = 1,
  pageSize = 10,
  isRecent = false,
  orgSlug
}: {
  page?: number
  pageSize?: number
  isRecent?: boolean
  orgSlug: string
}) =>
  apiClient.get<any>(`${orgSlug}/admin/services/recent`, {
    params: { page, pageSize, isRecent }
  })

const getServiceMetrics = (
  timeFrame:
    | 'seven-days'
    | 'today'
    | 'yesterday'
    | 'weekly'
    | 'monthly'
    | 'yearly',
  orgSlug: string
) =>
  apiClient.get<ApiResponse<ServiceMetrics[]>>(
    `${orgSlug}/admin/services/metrics?timeFrame=${timeFrame}`
  )

const getServicePopularity = (orgSlug: string) =>
  apiClient.get<ApiResponse<ServicePopularity[]>>(
    `${orgSlug}/admin/services/popularity`
  )

const dashboardService = {
  getDashboardStatistics,
  getRecentServices,
  getServiceMetrics,
  getServicePopularity
}

export default dashboardService
