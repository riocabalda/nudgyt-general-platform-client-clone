import {
  ApiResponse,
  SimulationDates,
  SimulationDetails,
  SimulationServiceDetails,
  SoftSkillsData,
  WithPagination
} from '../../types'
import apiClient from '../apiClient'

export type Simulation = {
  _id: string
  service: string
  service_level: string
  learner: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  started_at: string | null
  ended_at: string | null
  resumed_at: string[]
  paused_at: string[]
  time_limit: number | null
  simulation_result: {
    sections_score: SectionScore[]
    overall_score: number
    overall_correct: number
    overall_total: number
  }
  form_answers: FormAnswer[]
  message: string | undefined
}

type SectionScore = {
  section: string
  score: number
  correct: number
  total: number
}

export type FormAnswer = {
  section: string
  question_no: string
  answer: string
}

export type FormAnswersObjectType = {
  [section: string]: {
    [questionNo: string]: string
  }
}

type FormPayloadAnswerType = {
  [key: string]: string | undefined
}

export type FormPayloadSectionType = {
  [answer: string]: FormPayloadAnswerType
}

export type FormAnswersPayload = {
  formAnswers: FormPayloadSectionType | null
}

export type SimulationSurveyType = {
  creator?: string
  service?: string
  service_level?: string
  simulation: string
  useful: number
  easy: number
  confident: number
  comment: string
}

type SurveyAverage = Pick<
  SimulationSurveyType,
  'useful' | 'easy' | 'confident'
> | null

const startSimulationTrial = (
  orgSlug: string,
  payloadIds: Record<string, string>
) =>
  apiClient.post<ApiResponse<Simulation>>(
    `/${orgSlug}/admin/simulations/start`,
    {
      payloadIds
    }
  )

const pauseSimulationTrial = (orgSlug: string, simulationId: string) =>
  apiClient.patch(`/${orgSlug}/admin/simulations/${simulationId}/pause`)

const resumeSimulationTrial = (orgSlug: string, simulationId: string) =>
  apiClient.patch(`/${orgSlug}/admin/simulations/${simulationId}/resume`)

const stopSimulationTrial = (
  orgSlug: string,
  simulationId: string,
  payload: FormAnswersPayload
) =>
  apiClient.patch(`/${orgSlug}/admin/simulations/${simulationId}/stop`, payload)

const getSimulationResults = (simulationId: string, orgSlug: string) =>
  apiClient.get<any>(`/${orgSlug}/admin/simulations/${simulationId}/results`)

const getSimulationServiceDetails = (orgSlug: string, simulationId: string) =>
  apiClient.get<ApiResponse<SimulationServiceDetails>>(
    `/${orgSlug}/admin/simulations/${simulationId}/service-details`
  )

const getSimulationDates = (orgSlug: string, simulationId: string) =>
  apiClient.get<ApiResponse<SimulationDates>>(
    `/${orgSlug}/admin/simulations/${simulationId}/dates`
  )

const getSimulationDetails = (orgSlug: string, simulationId: string) =>
  apiClient.get<ApiResponse<SimulationDetails>>(
    `/${orgSlug}/admin/simulations/${simulationId}/details`
  )

const getSimulationSoftSkills = (orgSlug: string, simulationId: string) =>
  apiClient.get<ApiResponse<SoftSkillsData>>(
    `/${orgSlug}/admin/simulations/${simulationId}/soft-skills`
  )

const getSurveyAverage = (orgSlug: string, serviceId: string) =>
  apiClient.get<ApiResponse<SurveyAverage>>(
    `/${orgSlug}/admin/surveys/average?service_id=${serviceId}`
  )

const getSimulation = (orgSlug: string, simulationId: string) =>
  apiClient.get<ApiResponse<Simulation>>(
    `/${orgSlug}/admin/simulations/${simulationId}`
  )

const updateFormAnswers = (
  orgSlug: string,
  simulationId: string,
  payload: FormAnswersPayload
) =>
  apiClient.patch(
    `/${orgSlug}/admin/simulations/${simulationId}/form-answers`,
    payload
  )

const getPreviousAttemptSimulations = (orgSlug: string, queryString: string) =>
  apiClient.get<
    WithPagination<
      {
        simulation_id: string
        started_at: Date
        score: number
        competency: string
        simulation_type: string
        paused_at: Date[]
        ended_at: Date
      }[]
    >
  >(`/${orgSlug}/admin/simulations/previous-attempts/?${queryString}`)

const simulationService = {
  startSimulationTrial,
  pauseSimulationTrial,
  resumeSimulationTrial,
  stopSimulationTrial,
  getSimulationResults,
  getSimulationDates,
  getSimulationServiceDetails,
  getSimulationDetails,
  getSimulationSoftSkills,
  getSurveyAverage,
  getSimulation,
  updateFormAnswers,
  getPreviousAttemptSimulations
}

export default simulationService
