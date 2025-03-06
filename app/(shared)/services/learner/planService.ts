import { AnnotatedPlan, ApiResponse } from '../../types'
import apiClient from '../apiClient'

const getPlans = (orgSlug: string) =>
  apiClient.get<ApiResponse<AnnotatedPlan[]>>(`/${orgSlug}/learner/plans`)

const planService = {
  getPlans
}

export default planService
