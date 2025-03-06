import {
  ApiResponse,
  SimulationDates,
  SimulationDetails,
  SimulationServiceDetails,
  SoftSkillsData,
  WithPagination
} from '../../types'
import { Simulation } from '../admin/simulationService'
import apiClient from '../apiClient'

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

type SurveyAverage = Pick<
  SimulationSurveyType,
  'useful' | 'easy' | 'confident'
> | null

const startSimulationTrial = (
  orgSlug: string,
  payloadIds: Record<string, string>
) =>
  apiClient.post<ApiResponse<Simulation>>(
    `/${orgSlug}/trainer/simulations/start`,
    {
      payloadIds
    }
  )

const pauseSimulationTrial = (orgSlug: string, simulationId: string) =>
  apiClient.patch(`/${orgSlug}/trainer/simulations/${simulationId}/pause`)

const resumeSimulationTrial = (orgSlug: string, simulationId: string) =>
  apiClient.patch(`/${orgSlug}/trainer/simulations/${simulationId}/resume`)

const stopSimulationTrial = (
  orgSlug: string,
  simulationId: string,
  payload: FormAnswersPayload
) =>
  apiClient.patch(
    `/${orgSlug}/trainer/simulations/${simulationId}/stop`,
    payload
  )

const getSimulationServiceDetails = (orgSlug: string, simulationId: string) =>
  apiClient.get<ApiResponse<SimulationServiceDetails>>(
    `/${orgSlug}/trainer/simulations/${simulationId}/service-details`
  )

const getSimulationDates = (orgSlug: string, simulationId: string) =>
  apiClient.get<ApiResponse<SimulationDates>>(
    `/${orgSlug}/trainer/simulations/${simulationId}/dates`
  )

const getSimulationDetails = (orgSlug: string, simulationId: string) =>
  apiClient.get<ApiResponse<SimulationDetails>>(
    `/${orgSlug}/trainer/simulations/${simulationId}/details`
  )

const getSimulationSoftSkills = (orgSlug: string, simulationId: string) =>
  apiClient.get<ApiResponse<SoftSkillsData>>(
    `/${orgSlug}/trainer/simulations/${simulationId}/soft-skills`
  )

const getSurveyAverage = (orgSlug: string, serviceId: string) =>
  apiClient.get<ApiResponse<SurveyAverage>>(
    `/${orgSlug}/trainer/surveys/average?service_id=${serviceId}`
  )

const getSimulation = (orgSlug: string, simulationId: string) =>
  apiClient.get<ApiResponse<Simulation>>(
    `/${orgSlug}/trainer/simulations/${simulationId}`
  )

const updateFormAnswers = (
  orgSlug: string,
  simulationId: string,
  payload: FormAnswersPayload
) =>
  apiClient.patch(
    `/${orgSlug}/trainer/simulations/${simulationId}/form-answers`,
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
  >(`/${orgSlug}/trainer/simulations/previous-attempts/?${queryString}`)

const pingSimulation = (orgSlug: string) =>
  apiClient.get(`/${orgSlug}/trainer/simulations/ping`)

const simulationService = {
  startSimulationTrial,
  pauseSimulationTrial,
  resumeSimulationTrial,
  stopSimulationTrial,
  getSimulation,
  getSimulationDates,
  getSimulationServiceDetails,
  getSimulationDetails,
  getSimulationSoftSkills,
  getSurveyAverage,
  updateFormAnswers,
  getPreviousAttemptSimulations,
  pingSimulation
}

export default simulationService
