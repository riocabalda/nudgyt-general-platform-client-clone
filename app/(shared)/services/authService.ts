import axios from 'axios'
import serverConfig from '../config/serverConfig'
import apiClient from './apiClient'
import { User } from './userService'

type SignInFormData = {
  email: string
  password: string
}
type SignInData = {
  token: string
  user: User
}
type SignUpFormData = {
  email: string
  fullName: string
  role: string
  password: string
  confirmPassword: string
  invitationToken?: string
  isTermsAndConditionsAccepted: boolean
  organizationName: string | null
  organizationCode: string | null
}
type SignInResponse = {
  data: SignInData
  message: string
}
type SignUpResponse = {
  data?: SignInData
  message: string
}
type GetUserResponse = {
  data: User
  message: string
}

const getAuthUser = () => apiClient.get<GetUserResponse>('/auth/me')

const signIn = (formData: SignInFormData) =>
  apiClient.post<SignInResponse>('/auth/login', {
    email: formData.email,
    password: formData.password
  })

const signUp = async (formData: SignUpFormData) =>
  apiClient.post<SignUpResponse>('/auth/register', {
    email: formData.email,
    full_name: formData.fullName,
    organization_name: formData.organizationName,
    organization_code: formData.organizationCode,
    role: formData.role,
    password: formData.password,
    confirm_password: formData.confirmPassword,
    invitation_token: formData.invitationToken,
    isTermsAndConditionsAccepted: formData.isTermsAndConditionsAccepted
  })

const signout = () => apiClient.post('/auth/sign-out', {})

const authBroadcastingGuest = (guestToken: string) =>
  axios.post(
    `${serverConfig.url}/broadcasting/guest/auth`,
    {},
    {
      headers: {
        Authorization: 'Bearer ' + guestToken,
        Accept: 'application/json'
      }
    }
  )

const authService = {
  getAuthUser,
  signIn,
  signUp,
  signout,
  authBroadcastingGuest
}
export default authService
