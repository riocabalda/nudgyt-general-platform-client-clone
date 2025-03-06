import { ApiResponse, ServiceTypeEnum, WithPagination } from '../../types'
import apiClient from '../apiClient'
import { User } from '../userService'
import { Character } from './characterService'
import { OrganizationUser } from './organizationService'

type ServiceType = {
  _id: string
  name: string
  type: ServiceTypeEnum
  description: string
}

type Environment = {
  _id: string
  image: string
  simulation_link: string
  environment_id: string
  location: string
  description: string
}

// type FormQuestion = {
//   question: string
//   answer_type: string
//   options: { [key: string]: string }[]
// }

// type Rubric = {
//   _id: string
//   title: string
//   rubric_items: { [key: string]: string }[]
// }

export type ServiceLevel = {
  _id: string
  title: string
  description: string
  time_limit: number
  current_step: number
  last_attempt: string
  creator: User
  characters: Character[]
  environment: Environment
  form_questions: any
  form_questions_file: string | null
  rubrics: any
  started_at?: string
  deleted_at: string
  created_at: string
}

export type Service = {
  _id: string
  cover_image: string
  title: string
  description: string
  is_published: boolean
  creator: User
  service_type: ServiceType
  basic_level: ServiceLevel
  multi_level: ServiceLevel[]
  organization: OrganizationUser
  shared_to_organizations: OrganizationUser[]
  last_paused_at?: string
  simulations?: any[]
  created_at: string
  last_attempt?: Date
  ended_at?: Date
}

export type ServiceStat = {
  createdAt: string
  creator: string
  totalLearners: number
  totalUsageTime: number
  service: string
}

export type GetServiceStats = {
  from: number
  to: number
  total: number
  current_page: number
  prev_page?: string
  next_page?: string
  data: ServiceStat[]
}

export type LearnersScores = {
  best_score: number
  simulation_id: string
  user: {
    _id: string
    full_name: string
  }
}

const getServices = (orgSlug: string, queryString?: string) =>
  apiClient.get<WithPagination<Service[]>>(
    `/${orgSlug}/admin/services?${queryString}`
  )

const getService = (orgSlug: string, id: string) =>
  apiClient.get<ApiResponse<Service>>(`/${orgSlug}/admin/services/${id}`)

const getRecentServices = (orgSlug: string, queryString?: string) =>
  apiClient.get<WithPagination<Service[]>>(
    `/${orgSlug}/admin/services/recent?${queryString}`
  )

const publishService = (orgSlug: string, serviceId: string) =>
  apiClient.patch(`/${orgSlug}/admin/services/${serviceId}/publish`)

const unpublishService = (orgSlug: string, serviceId: string) =>
  apiClient.patch(`/${orgSlug}/admin/services/${serviceId}/unpublish`)

const deleteService = (orgSlug: string, serviceId: string) =>
  apiClient.patch(`/${orgSlug}/admin/services/${serviceId}/delete`)

const getServiceTypes = (orgSlug: string) =>
  apiClient.get<any>(`/${orgSlug}/admin/services/service-types`)

const createService = (orgSlug: string, payload: FormData) =>
  apiClient.post<any>(`/${orgSlug}/admin/services`, payload)

const editService = (orgSlug: string, serviceId: string, payload: FormData) =>
  apiClient.patch<any>(`/${orgSlug}/admin/services/${serviceId}`, payload)

const getServicesStats = (orgSlug: string, queryString?: string) =>
  apiClient.get<ApiResponse<GetServiceStats>>(
    `/${orgSlug}/admin/services/stats${queryString ? `?${queryString}` : ''}`
  )

const getServiceLearnersScores = (orgSlug: string, serviceId: string) =>
  apiClient.get<ApiResponse<LearnersScores[]>>(
    `/${orgSlug}/admin/services/${serviceId}/learners-scores`
  )

const serviceService = {
  createService,
  editService,
  getServices,
  getService,
  getRecentServices,
  publishService,
  unpublishService,
  deleteService,
  getServiceTypes,
  getServicesStats,
  getServiceLearnersScores
}

export default serviceService
