import axios, { AxiosError, AxiosRequestConfig, HttpStatusCode } from 'axios'
import serverConfig from '../config/serverConfig'
import authTokenService from './authTokenService'

function createRetryRequestConfig(error: AxiosError): AxiosRequestConfig {
  const { config } = error
  if (config === undefined) {
    throw new Error('Axios request config not available...?')
  }

  /** References the same config object, but typed as `any` to allow for arbitrary property access */
  const configAsAny: any = config

  /**
   * Add custom property as support for repeating the same request (via Axios config)
   *
   * Request is repeated at most only once, when the `_retry` flag is set
   *
   * `_retry` is not used by Axios, it is solely for the purpose of repeating the request here
   */
  const isRetry: boolean = configAsAny?._retry ?? false
  if (isRetry) {
    throw new Error('Request to retry has already been retried')
  }
  configAsAny._retry = true

  return { ...config }
}

const apiClient = axios.create({
  baseURL: serverConfig.url,
  withCredentials: true,
  headers: {
    Accept: 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    // Get the token from your authentication system or storage
    const token = authTokenService.getAccessToken()

    // Add the Bearer token to the 'Authorization' header
    config.headers.Authorization = `Bearer ${token}`

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (error instanceof AxiosError) {
      const { response } = error

      /**
       * Catch Forbidden responses, specifically for when access token is expired
       *
       * - https://www.thedutchlab.com/en/insights/using-axios-interceptors-for-refreshing-your-api-token
       * - https://github.com/axios/axios/issues/5163
       * - https://stackoverflow.com/a/73512909
       * - https://stackoverflow.com/a/76302364
       */
      if (
        response !== undefined &&
        response.status === HttpStatusCode.Forbidden &&
        response.data?.message === 'Access token is expired.'
      ) {
        console.warn('Request with expired access token failed; refreshing...')
        try {
          await authTokenService.refreshAccessToken(apiClient)
        } catch {
          console.error('Failed refreshing access token')

          return Promise.reject(error)
        }

        console.warn('Retrying request with new access token...')

        let retryReqConfig: AxiosRequestConfig
        try {
          retryReqConfig = createRetryRequestConfig(error)
        } catch {
          console.error('Failed creating config of request to retry')

          return Promise.reject(error)
        }

        /** Retry request */
        return apiClient(retryReqConfig)
      }

      /** Automatically signs out upon receiving Unauthorized response */
      if (
        response !== undefined &&
        response.status === HttpStatusCode.Unauthorized &&
        response.config.url !== '/api/register'
      ) {
        window.dispatchEvent(new Event('user:signout'))
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
