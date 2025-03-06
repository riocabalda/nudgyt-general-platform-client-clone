import { ApiResponse, ServiceTypeEnum, WithPagination } from '../../types'
import { OrganizationUser } from '../admin/organizationService'
import apiClient from '../apiClient'
import { User } from '../userService'
import { Character } from './characterService'

export type ServiceType = {
  _id: string
  name: string
  type: ServiceTypeEnum
  description: string
}

export type Environment = {
  _id: string
  image: string
  simulation_link: string
  environment_id: string
  location: string
  description: string
}

export type FormQuestions = {
  _id: string
  service_id: string
  section: string
  question_no: string
  question_type: string
  question_title: string
  question_description: string | undefined
  options: FormQuestionOption[]
  correct_answer: string
  pre_fill: string
  deleted_at: string
}

export type ServiceLevel = {
  _id: string
  title: string
  description: string
  current_step: number
  last_attempt: string
  creator: User
  time_limit: number
  characters: Character[]
  environment: Environment
  form_questions: FormQuestions[]
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
}

type FormQuestionOption = {
  _id: string
  option: string
  option_description: string
  pre_fill: string
}

const getServices = (orgSlug: string, queryString?: string) =>
  apiClient.get<WithPagination<Service[]>>(
    `/${orgSlug}/learner/services?${queryString}`
  )

const getService = (orgSlug: string, id: string) =>
  apiClient.get<ApiResponse<Service>>(`/${orgSlug}/learner/services/${id}`)

const serviceService = {
  getServices,
  getService
}

export default serviceService
