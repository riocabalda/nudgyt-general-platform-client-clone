import { ApiResponse } from '../../types'
import apiClient from '../apiClient'

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

const getServices = ({
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
  apiClient.get<any>(`${orgSlug}/admin/services`, {
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

const usageService = {
  getServices,
  getServiceMetrics,
  getServicePopularity
}

export default usageService
