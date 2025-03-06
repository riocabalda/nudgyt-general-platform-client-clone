import apiClient from '../apiClient'

const getAvatars = (orgSlug: string) =>
  apiClient.get<any>(`/${orgSlug}/trainer/avatars`)

const getAvatarById = (id?: string, orgSlug?: string) =>
  apiClient.get<any>(`/${orgSlug}/trainer/avatars/${id}`)

const avatarService = {
  getAvatars,
  getAvatarById
}

export default avatarService
