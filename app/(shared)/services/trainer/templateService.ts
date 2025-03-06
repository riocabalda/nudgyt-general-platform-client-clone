import {
  ApiResponse,
  Character,
  Environment,
  Organization,
  Pagination,
  WithPagination
} from '../../types'
import apiClient from '../apiClient'
import { User } from '../userService'

export type Template = {
  _id: string
  master_template_id: string | null
  is_master_template: boolean
  title: string | null
  description: string | null
  time_limit: number
  is_published: boolean
  current_step: number | null
  creator: User
  service_type: any
  form_questions: any
  form_questions_file: string | null
  rubrics: any
  organization: Organization
  shared_to_organizations: string[]
  characters: Character[]
  environment: Environment
  deleted_at: Date | null
  created_at: string
}

export type TemplateData = Pagination & {
  data: Template[]
}

type TemplateResponse = {
  message: string
  data: Template
}

const getMostPopularTemplates = (orgSlug: string) =>
  apiClient.get<ApiResponse<TemplateData>>(
    `/${orgSlug}/trainer/templates/most-popular`
  )

const getTemplates = (orgSlug: string, queryString?: string) =>
  apiClient.get<WithPagination<Template[]>>(
    `/${orgSlug}/trainer/templates?${queryString}`
  )

const getTemplateById = (orgSlug: string, id: string) =>
  apiClient.get<TemplateResponse>(`/${orgSlug}/trainer/templates/${id}`)

const createTemplate = (orgSlug: string, templateData: any) =>
  apiClient.post<TemplateResponse>(
    `/${orgSlug}/trainer/templates`,
    templateData
  )

const editTemplate = (orgSlug: string, templateId: string, templateData: any) =>
  apiClient.patch<TemplateResponse>(
    `/${orgSlug}/trainer/templates/${templateId}`,
    templateData
  )

const deleteTemplate = (orgSlug: string, templateId: string) =>
  apiClient.delete<TemplateResponse>(
    `/${orgSlug}/trainer/templates/${templateId}`
  )

const shareTemplate = (orgSlug: string, templateId: string, payload: any) =>
  apiClient.post<TemplateResponse>(
    `/${orgSlug}/trainer/templates/${templateId}/share`,
    payload
  )

const getSharedTemplates = (orgSlug: string) =>
  apiClient.get<any>(`/${orgSlug}/trainer/templates/shared`)

const duplicateTemplate = (orgSlug: string, templateId: string) =>
  apiClient.post<TemplateResponse>(
    `/${orgSlug}/trainer/templates/${templateId}/duplicate`
  )

const publishTemplate = (orgSlug: string, templateId: string) =>
  apiClient.post<TemplateResponse>(
    `/${orgSlug}/trainer/templates/${templateId}/publish`
  )

const unpublishTemplate = (orgSlug: string, templateId: string) =>
  apiClient.post<TemplateResponse>(
    `/${orgSlug}/trainer/templates/${templateId}/unpublish`
  )

const templateService = {
  getTemplates,
  getTemplateById,
  createTemplate,
  editTemplate,
  shareTemplate,
  getSharedTemplates,
  deleteTemplate,
  duplicateTemplate,
  getMostPopularTemplates,
  publishTemplate,
  unpublishTemplate
}

export default templateService
