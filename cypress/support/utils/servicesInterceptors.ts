import mockServices from '../../fixtures/admin/services/services.json'
import newServicesData from '../../fixtures/learner/services/newServices.json'
import recentServicesData from '../../fixtures/learner/services/recentServices.json'
import {
  filterServices,
  savedSimulationServices,
  SortOption,
  sortServices
} from './servicesFilters'

const apiBaseUrl = Cypress.env('apiBaseUrl')

// Helper to intercept API requests
const interceptAPI = (
  alias: string,
  method: 'GET' | 'POST',
  url: string,
  body: object
) => {
  cy.intercept(method, url, {
    statusCode: 200,
    body
  }).as(alias)
}

// Admin Interceptors
export const interceptAdminServices = (orgSlug: string) => {
  const baseUrl = `${apiBaseUrl}/${orgSlug}/admin/services`
  interceptAPI('getServices', 'GET', `${baseUrl}?`, mockServices)
  interceptAPI('getServicesMobile', 'GET', `${baseUrl}?page=1`, mockServices)
}

export const interceptAdminSearchServices = (
  orgSlug: string,
  searchParam: string
) => {
  const baseUrl = `${apiBaseUrl}/${orgSlug}/admin/services`
  const searchQuery = searchParam.replace(/ /g, '+')
  const searchData = filterServices(mockServices.data as any, searchParam)

  interceptAPI('getSearchServices', 'GET', `${baseUrl}?search=${searchQuery}`, {
    data: searchData
  })

  interceptAPI(
    'getSearchServicesMobile',
    'GET',
    `${baseUrl}?page=1&search=${searchQuery}`,
    { data: searchData }
  )
}

export const interceptSortedServices = (orgSlug: string) => {
  const baseUrl = `${apiBaseUrl}/${orgSlug}/admin/services`
  const filters = [
    'newest',
    'oldest',
    'alphabetical',
    'most_attempts',
    'least_attempts',
    'latest_attempts',
    'saved_simulation'
  ]

  filters.forEach((filter) => {
    interceptAPI(
      `get${capitalize(filter)}Services`,
      'GET',
      `${baseUrl}?filter=${filter}`,
      { data: sortServices(mockServices.data as any, filter as SortOption) }
    )
  })
}

// Learner Interceptors
export const interceptLearnerServices = (orgSlug: string) => {
  const baseUrl = `${apiBaseUrl}/${orgSlug}/learner/services`

  const learnerEndpoints = [
    { alias: 'getNewServices', view: 'new', data: newServicesData },
    { alias: 'getRecentServices', view: 'recent', data: recentServicesData }
  ]

  learnerEndpoints.forEach(({ alias, view, data }) => {
    interceptAPI(alias, 'GET', `${baseUrl}?service_view=${view}`, data)

    // Add sorting filters
    const filters = [
      'newest',
      'oldest',
      'alphabetical',
      'most_attempts',
      'least_attempts',
      'saved_simulation'
    ]
    filters.forEach((filter) => {
      interceptAPI(
        `${alias}${capitalize(filter)}`,
        'GET',
        `${baseUrl}?service_view=${view}&filter=${filter}`,
        { data: sortServices(data.data as any, filter as SortOption) }
      )
    })

    // Saved simulation filter
    interceptAPI(
      `${alias}SavedSimulation`,
      'GET',
      `${baseUrl}?service_view=${view}&filter=saved_simulation`,
      { data: savedSimulationServices(data.data as any) }
    )
  })
}

// Helper function to capitalize filter names for aliasing
const capitalize = (str: string) =>
  str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
