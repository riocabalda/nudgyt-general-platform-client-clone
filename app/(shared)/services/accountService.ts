import apiClient from './apiClient'

const updatePersonalDetails = (formData: any) =>
  apiClient.patch(`/auth/settings/personal-details`, formData)

const updatePassword = (formData: any) =>
  apiClient.patch(`/auth/update-password`, formData)

const accountService = {
  updatePersonalDetails,
  updatePassword
}

export default accountService
