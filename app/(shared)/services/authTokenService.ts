import { AxiosInstance, AxiosResponse } from 'axios'

type AuthRefreshData = { token: string }
type AuthRefreshResponse = {
  message: string
  data: AuthRefreshData
}

let refreshFetch: Promise<AxiosResponse<AuthRefreshResponse>> | null = null

async function refreshAccessToken(apiClient: AxiosInstance) {
  /** Perform only single refresh at a time */
  if (refreshFetch === null) {
    console.warn('Requesting access token refresh...')

    refreshFetch = apiClient.get<AuthRefreshResponse>('/auth/refresh')
  }

  try {
    const { data: res } = await refreshFetch
    const { token } = res.data

    setAccessToken(token)
  } catch (error) {
    throw error
  } finally {
    refreshFetch = null
  }
}

const accessTokenKey = 'nudgyt-atkn'

const setAccessToken = (accessToken: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(accessTokenKey, JSON.stringify({ accessToken }))
  }
}

const getAccessToken = () => {
  const jsonData =
    typeof window !== 'undefined'
      ? localStorage.getItem(accessTokenKey)
      : undefined
  if (jsonData) {
    try {
      const data = JSON.parse(jsonData)
      return data.accessToken || null
    } catch (error: any) {
      return null
    }
  }
  return null
}

const removeTokens = () => {
  localStorage.removeItem(accessTokenKey)
}

const authTokenService = {
  refreshAccessToken,
  setAccessToken,
  getAccessToken,
  removeTokens,
  accessTokenKey
}

export default authTokenService
