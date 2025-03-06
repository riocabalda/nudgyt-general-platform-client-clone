import { ApiResponse } from '../../types'
import apiClient from '../apiClient'

export type OldSubscription = {
  id: string
  name: string
  features: string
  price: string
  time: string
}

type Subscription = {
  status: string
}

export const SubscriptionStatus = {
  ACTIVE: 'active'
}

const getSubscriptions = () => apiClient.get('/admin/subscriptions')

const updateSubscription = (formData: any) =>
  apiClient.post('/admin/subscriptions', formData)

const getCurrentSubscription = (orgSlug: string) =>
  apiClient.get<ApiResponse<Subscription | null>>(
    `/${orgSlug}/admin/subscriptions/current`
  )

const subscriptionService = {
  getSubscriptions,
  updateSubscription,
  getCurrentSubscription
}

export default subscriptionService
