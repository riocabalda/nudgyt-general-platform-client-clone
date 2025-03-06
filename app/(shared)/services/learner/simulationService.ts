import apiClient from '../apiClient'
import {
  ApiResponse,
  SimulationDates,
  SimulationDetails,
  SimulationServiceDetails,
  SoftSkillsData,
  WithPagination
} from '../../types'

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

type FormPayloadAnswerType = {
  [key: string]: string | undefined
}

export type FormPayloadSectionType = {
  [answer: string]: FormPayloadAnswerType
}

export type SoftSkillRating = {
  skill: string
  score: number
  total: number
  description: string
  importance: string
  assessment: string[]
}

export type FormAnswersPayload = {
  formAnswers: FormPayloadSectionType | null
}

const startSimulation = (orgSlug: string, payloadIds: Record<string, string>) =>
  apiClient.post<ApiResponse<Simulation>>(
    `/${orgSlug}/learner/simulations/start`,
    {
      payloadIds
    }
  )

const pauseSimulation = (orgSlug: string, simulationId: string) =>
  apiClient.patch(`/${orgSlug}/learner/simulations/${simulationId}/pause`)

const resumeSimulation = (orgSlug: string, simulationId: string) =>
  apiClient.patch(`/${orgSlug}/learner/simulations/${simulationId}/resume`)

const stopSimulation = (
  orgSlug: string,
  simulationId: string,
  payload: FormAnswersPayload
) =>
  apiClient.patch(
    `/${orgSlug}/learner/simulations/${simulationId}/stop`,
    payload
  )

const getSimulation = (orgSlug: string, simulationId: string) =>
  apiClient.get<ApiResponse<Simulation>>(
    `/${orgSlug}/learner/simulations/${simulationId}`
  )

const createSimulationSurvey = (orgSlug: string, form: SimulationSurveyType) =>
  apiClient.post<ApiResponse<SimulationSurveyType>>(
    `/${orgSlug}/learner/surveys`,
    form
  )

const getSimulationSurvey = (orgSlug: string, simulationId: string) =>
  apiClient.get<ApiResponse<SimulationSurveyType[]>>(
    `/${orgSlug}/learner/surveys?simulation_id=${simulationId}`
  )

const updateFormAnswers = (
  orgSlug: string,
  simulationId: string,
  payload: FormAnswersPayload
) =>
  apiClient.patch(
    `/${orgSlug}/learner/simulations/${simulationId}/form-answers`,
    payload
  )

const getSimulationResults = (simulationId: string, orgSlug: string) =>
  apiClient.get<any>(`/${orgSlug}/learner/simulations/${simulationId}/results`)

const getSimulationServiceDetails = (orgSlug: string, simulationId: string) =>
  apiClient.get<ApiResponse<SimulationServiceDetails>>(
    `/${orgSlug}/learner/simulations/${simulationId}/service-details`
  )

const getSimulationDates = (orgSlug: string, simulationId: string) =>
  apiClient.get<ApiResponse<SimulationDates>>(
    `/${orgSlug}/learner/simulations/${simulationId}/dates`
  )

const getSimulationDetails = (orgSlug: string, simulationId: string) =>
  apiClient.get<ApiResponse<SimulationDetails>>(
    `/${orgSlug}/learner/simulations/${simulationId}/details`
  )

const getSimulationSoftSkills = (orgSlug: string, simulationId: string) =>
  apiClient.get<ApiResponse<SoftSkillsData>>(
    `/${orgSlug}/learner/simulations/${simulationId}/soft-skills`
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
  >(`/${orgSlug}/learner/simulations/previous-attempts/?${queryString}`)

const pingSimulation = (orgSlug: string) =>
  apiClient.get(`/${orgSlug}/learner/simulations/ping`)

const simulationService = {
  startSimulation,
  pauseSimulation,
  resumeSimulation,
  stopSimulation,
  getSimulation,
  getSimulationSurvey,
  updateFormAnswers,
  createSimulationSurvey,
  getSimulationResults,
  getSimulationDates,
  getSimulationServiceDetails,
  getSimulationDetails,
  getSimulationSoftSkills,
  getPreviousAttemptSimulations,
  pingSimulation
}

export default simulationService
