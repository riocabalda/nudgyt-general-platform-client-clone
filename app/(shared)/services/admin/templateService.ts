import { Organization, WithPagination } from '../../types'
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
  characters: any
  environment: any
  deleted_at: Date | null
}

type TemplateResponse = {
  message: string
  data: Template
}

const getTemplates = (orgSlug: string, queryString?: string) =>
  apiClient.get<WithPagination<Template[]>>(
    `/${orgSlug}/admin/templates?${queryString}`
  )

const getTemplateById = (orgSlug: string, id: string) =>
  apiClient.get<TemplateResponse>(`/${orgSlug}/admin/templates/${id}`)

const createTemplate = (orgSlug: string, templateData: any) =>
  apiClient.post<TemplateResponse>(`/${orgSlug}/admin/templates`, templateData)

const editTemplate = (orgSlug: string, templateId: string, templateData: any) =>
  apiClient.patch<TemplateResponse>(
    `/${orgSlug}/admin/templates/${templateId}`,
    templateData
  )

const deleteTemplate = (orgSlug: string, templateId: string) =>
  apiClient.delete<TemplateResponse>(
    `/${orgSlug}/admin/templates/${templateId}`
  )

const shareTemplate = (orgSlug: string, templateId: string, payload: any) =>
  apiClient.post<TemplateResponse>(
    `/${orgSlug}/admin/templates/${templateId}/share`,
    payload
  )

const getSharedTemplates = (orgSlug: string) =>
  apiClient.get<any>(`/${orgSlug}/admin/templates/shared`)

const duplicateTemplate = (orgSlug: string, templateId: string) =>
  apiClient.post<TemplateResponse>(
    `/${orgSlug}/admin/templates/${templateId}/duplicate`
  )

const publishTemplate = (orgSlug: string, templateId: string) =>
  apiClient.post<TemplateResponse>(
    `/${orgSlug}/admin/templates/${templateId}/publish`
  )

const unpublishTemplate = (orgSlug: string, templateId: string) =>
  apiClient.post<TemplateResponse>(
    `/${orgSlug}/admin/templates/${templateId}/unpublish`
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
  publishTemplate,
  unpublishTemplate
}

export default templateService
