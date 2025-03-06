import { ApiResponse, TranscriptComment, TranscriptType } from '../../types'
import apiClient from '../apiClient'

export type TranscriptPayload = {
  fromType: string
  simulationId: string
  dialogueValue: string
  personalityId: string
  characterName: string
}

const getTranscriptsBySimulation = (simulationId: string, orgSlug: string) =>
  apiClient.get<ApiResponse<TranscriptType[]>>(
    `/${orgSlug}/admin/transcripts/${simulationId}`
  )

const createComment = (transcriptId: string, orgSlug: string, text: string) =>
  apiClient.post<ApiResponse<TranscriptComment>>(
    `/${orgSlug}/admin/transcripts/create-comment`,
    { transcriptId, text }
  )

const deleteComment = (
  transcriptId: string,
  commentId: string,
  orgSlug: string
) =>
  apiClient.post<ApiResponse<TranscriptComment>>(
    `/${orgSlug}/admin/transcripts/delete-comment`,
    { transcriptId, commentId }
  )

const saveTranscriptTrial = (orgSlug: string, payload: TranscriptPayload) =>
  apiClient.post<ApiResponse<TranscriptType>>(
    `${orgSlug}/admin/transcripts`,
    payload
  )

const transcriptService = {
  getTranscriptsBySimulation,
  createComment,
  deleteComment,
  saveTranscriptTrial
}

export default transcriptService
