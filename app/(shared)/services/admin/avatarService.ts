import apiClient from '../apiClient'

const getAvatars = (orgSlug: string) =>
  apiClient.get<any>(`/${orgSlug}/admin/avatars`)

const getAvatarById = (id?: string, orgSlug?: string) =>
  apiClient.get<any>(`/${orgSlug}/admin/avatars/${id}`)

const avatarService = {
  getAvatars,
  getAvatarById
}

export default avatarService
