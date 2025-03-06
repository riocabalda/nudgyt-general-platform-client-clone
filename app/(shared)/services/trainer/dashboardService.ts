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
const getServices = ({
  page = 1,
  pageSize = 10,
  isRecent = false,
  orgSlug,
  search
}: {
  page?: number
  pageSize?: number
  isRecent?: boolean
  orgSlug: string
  search?: string
}) =>
  apiClient.get<any>(`${orgSlug}/trainer/services`, {
    params: { page, pageSize, isRecent, search }
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
    `${orgSlug}/trainer/services/metrics?timeFrame=${timeFrame}`
  )

const getServicePopularity = (orgSlug: string) =>
  apiClient.get<ApiResponse<ServicePopularity[]>>(
    `${orgSlug}/trainer/services/popularity`
  )

const dashboardService = {
  getDashboardStatistics,
  getServices,
  getServiceMetrics,
  getServicePopularity
}

export default dashboardService
