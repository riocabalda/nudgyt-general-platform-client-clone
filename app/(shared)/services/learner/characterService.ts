import { ApiResponse, Avatar } from '../../types'
import apiClient from '../apiClient'

export type Service = {
  [key: string]: any
}

export type VoiceType = {
  name: string
  voice_value: string
  sample_link: string
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

export type GetAllCharacters = {
  from: number
  to: number
  total: number
  prev: string | undefined
  next: string | undefined
  current_page: number
  data: Character[]
}

const getCharacterVoiceTypes = (orgSlug: string) =>
  apiClient.get<ApiResponse<VoiceType[]>>(
    `/${orgSlug}/learner/characters/voice-types`
  )

const characterService = {
  getCharacterVoiceTypes
}

export default characterService
