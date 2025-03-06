import { ApiResponse, Avatar } from '../../types'
import apiClient from '../apiClient'

export type Service = {
  [key: string]: any
}

export type VoiceType = {
  name: string
  voice_value: string
  sample_link: string
  lang_codes: string[]
}

export type Character = {
  _id: string
  name: string
  avatar: Avatar
  age: string
  hidden_backstory: string
  backstory: string
  personality_id: string
  voice_type: string
  languages: string[]
  personality: any
  createdAt: string
  createdBy: string
  services: string[]
  serviceCount: number
}

export type GetPaginatedCharacters = {
  from: number
  to: number
  total: number
  prev: string | undefined
  next: string | undefined
  current_page: number
  data: Character[]
}

export type AvailableLanguages = {
  lang_code: string
  lang_name: string
}

const getPaginatedCharacters = (orgSlug: string, queryString?: string) =>
  apiClient.get<ApiResponse<GetPaginatedCharacters>>(
    `/${orgSlug}/admin/characters/paginated?${queryString}`
  )

const getCharacter = (orgSlug: string, characterId: string) =>
  apiClient.get<
    ApiResponse<{
      details: Character
      services: any[]
    }>
  >(`/${orgSlug}/admin/characters/${characterId}`)

const updateCharacter = (orgSlug: string, characterId: string, data: any) =>
  apiClient.put(`/${orgSlug}/admin/characters/${characterId}`, data)

const createCharacter = (orgSlug: string, characterData: any) =>
  apiClient.post<any>(`/${orgSlug}/admin/characters`, characterData)

const getCharacters = (orgSlug: string, searchParams: string) =>
  apiClient.get<any>(`/${orgSlug}/admin/characters?${searchParams}`)

const getCharacterVoiceTypes = (orgSlug: string) =>
  apiClient.get<any>(`/${orgSlug}/admin/characters/voice-types`)

const getCharacterAvailableLanguages = (orgSlug: string) =>
  apiClient.get<ApiResponse<AvailableLanguages[]>>(
    `/${orgSlug}/admin/characters/available-languages`
  )

const characterService = {
  createCharacter,
  getCharacters,
  getPaginatedCharacters,
  getCharacter,
  updateCharacter,
  getCharacterVoiceTypes,
  getCharacterAvailableLanguages
}

export default characterService
