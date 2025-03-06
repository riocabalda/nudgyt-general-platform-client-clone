import { ApiResponse, TranscriptComment, TranscriptType } from '../../types'
import { TranscriptPayload } from '../admin/transcriptService'
import apiClient from '../apiClient'

const getTranscriptsBySimulation = (simulationId: string, orgSlug: string) =>
  apiClient.get<ApiResponse<TranscriptType[]>>(
    `/${orgSlug}/trainer/transcripts/${simulationId}`
  )

const createComment = (transcriptId: string, orgSlug: string, text: string) =>
  apiClient.post<ApiResponse<TranscriptComment>>(
    `/${orgSlug}/trainer/transcripts/create-comment`,
    { transcriptId, text }
  )

const deleteComment = (
  transcriptId: string,
  commentId: string,
  orgSlug: string
) =>
  apiClient.post<ApiResponse<TranscriptComment>>(
    `/${orgSlug}/trainer/transcripts/delete-comment`,
    { transcriptId, commentId }
  )

const saveTranscriptTrial = (orgSlug: string, payload: TranscriptPayload) =>
  apiClient.post<ApiResponse<TranscriptType>>(
    `${orgSlug}/trainer/transcripts`,
    payload
  )

const transcriptService = {
  getTranscriptsBySimulation,
  createComment,
  deleteComment,
  saveTranscriptTrial
}

export default transcriptService
