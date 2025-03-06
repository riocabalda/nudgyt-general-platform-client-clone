import apiClient from '../apiClient'
import { User } from '../userService'
import { Character } from './characterService'
import { ApiResponse } from '../../types'

export type TranscriptComment = {
  _id: string
  from_type: string
  from: Pick<User, '_id' | 'full_name' | 'email'> | null
  text: string
  created_at: string
  updated_at: string
}

export type FromToType = 'character' | 'user'

export type TranscriptType = {
  _id: string
  from: Pick<User, 'full_name'> | Pick<Character, 'name'> | null
  from_type: FromToType
  to?: Pick<User, 'full_name'> | Pick<Character, 'name'> | null
  to_type?: FromToType
  simulation_id: string
  dialogue_value: string
  comments: TranscriptComment[]
}

export type NewTranscriptType = Omit<TranscriptType, '_id' | 'comments'>

export type TranscriptPayload = {
  fromType: string
  simulationId: string
  dialogueValue: string
  personalityId: string
  characterName: string
}

const saveTranscript = (orgSlug: string, payload: TranscriptPayload) =>
  apiClient.post<ApiResponse<TranscriptType>>(
    `${orgSlug}/learner/transcripts`,
    payload
  )

const getTranscripts = (orgSlug: string, simulationId: string) =>
  apiClient.get<ApiResponse<TranscriptType[]>>(
    `${orgSlug}/learner/transcripts/${simulationId}`
  )

const getTranscriptsBySimulation = (simulationId: string, orgSlug: string) =>
  apiClient.get<ApiResponse<TranscriptType[]>>(
    `/${orgSlug}/learner/transcripts/${simulationId}`
  )

const createComment = (transcriptId: string, orgSlug: string, text: string) =>
  apiClient.post<ApiResponse<TranscriptComment>>(
    `/${orgSlug}/learner/transcripts/create-comment`,
    { transcriptId, text }
  )

const deleteComment = (
  transcriptId: string,
  commentId: string,
  orgSlug: string
) =>
  apiClient.post<ApiResponse<TranscriptComment>>(
    `/${orgSlug}/learner/transcripts/delete-comment`,
    { transcriptId, commentId }
  )

const transcriptService = {
  saveTranscript,
  getTranscripts,
  getTranscriptsBySimulation,
  createComment,
  deleteComment
}

export default transcriptService
