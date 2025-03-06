import { interceptLearnerServices } from '../../../support/utils/servicesInterceptors'
import { filterServices } from '../../../support/utils/servicesFilters'
import mockServices from '../../../fixtures/learner/services/services.json'

describe('Learner Services Search', () => {
  const apiBaseUrl = Cypress.env('apiBaseUrl')
  const DEVICES = ['Desktop', 'Mobile']
  const orgSlug = 'public'

  DEVICES.forEach((device) => {
    context(device, () => {
      beforeEach(() => {
        if (device === 'Desktop') {
          cy.viewport(1920, 1080)
        }
        if (device === 'Mobile') {
          cy.viewport('iphone-se2')
        }

        cy.assumeLogin('learner')
        interceptLearnerServices(orgSlug)
      })

      it('should display results when searching for a valid term', () => {
        const searchTitle = 'Personalized Consulting Services'

        cy.intercept(
          'GET',
          `${apiBaseUrl}/${orgSlug}/learner/services?search=${searchTitle.replace(/ /g, '+')}`,
          {
            statusCode: 200,
            body: {
              data: filterServices(mockServices.data as any, searchTitle)
            }
          }
        ).as('getSearchServices')

        cy.visit(`/${orgSlug}/learner/services`)

        // Clear search input if there's any existing text
        cy.get('input[placeholder="Search"]').clear()

        // Type a search term that you expect to find results for
        cy.get('input[placeholder="Search"]').type(searchTitle)

        cy.get('[data-cy=services]')
          .should('have.length', 1)
          .contains(searchTitle)
      })

      it('should handle no results found', () => {
        const searchTitle = 'Sample Title'
        cy.intercept(
          'GET',
          `${apiBaseUrl}/${orgSlug}/learner/services?search=${searchTitle.replace(/ /g, '+')}`,
          {
            statusCode: 200,
            body: {
              data: filterServices(mockServices.data as any, searchTitle)
            }
          }
        ).as('getSearchServices')

        cy.visit(`/${orgSlug}/learner/services`)

        // Clear search input if there's any existing text
        cy.get('input[placeholder="Search"]').clear()

        cy.get('input[placeholder="Search"]').type(searchTitle)

        cy.get('div').contains('No services found')
      })
    })
  })
})
