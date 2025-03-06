import { WithPagination } from '../../types'
import apiClient from '../apiClient'

export type ActivityLog = {
  _id: string
  type: string
  activity: string
  created_at: string
}

const getActivityLogs = (org: string, queryString?: string) =>
  apiClient.get<WithPagination<ActivityLog[]>>(
    `${org}/admin/logs?${queryString}`
  )

const logService = {
  getActivityLogs
}

export default logService
