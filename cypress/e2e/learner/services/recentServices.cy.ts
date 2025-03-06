import { interceptLearnerServices } from '../../../support/utils/servicesInterceptors'
import { filterServices } from '../../../support/utils/servicesFilters'
import recentServicesData from '../../../fixtures/learner/services/recentServices.json'

describe('Learner Recent Services', () => {
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

        cy.visit(`/${orgSlug}/learner/services`)
      })

      it('show recent services', () => {
        cy.contains('h1', 'Your recent services')
          .siblings('a')
          .contains('See All')
          .click()

        cy.wait('@getRecentServices')

        cy.get('[data-cy=services]').should('have.length', 4)

        cy.get('[data-cy=services]').each(($div, index) => {
          const service = recentServicesData.data[index]
          cy.wrap($div).should('contain.text', service?.title)
        })
      })

      it('no recent services', () => {
        cy.intercept(
          'GET',
          `${apiBaseUrl}/${orgSlug}/learner/services?service_view=recent`,
          {
            statusCode: 200,
            body: { data: [] }
          }
        ).as('getRecentServices')

        cy.contains('h1', 'Your recent services')
          .siblings('a')
          .contains('See All')
          .click()

        cy.get('div').contains('No recent services')
      })

      it('show searched recent services', () => {
        const searchTitle = 'Financial Planning and Advisory'

        cy.intercept(
          'GET',
          `${apiBaseUrl}/${orgSlug}/learner/services?service_view=recent&search=${searchTitle.replace(/ /g, '+')}`,
          {
            statusCode: 200,
            body: {
              data: filterServices(recentServicesData.data as any, searchTitle)
            }
          }
        ).as('getSearchRecentServices')

        cy.contains('h1', 'Your recent services')
          .siblings('a')
          .contains('See All')
          .click()

        cy.wait('@getRecentServices')

        cy.get('[data-cy=services]').should('have.length', 4)

        cy.get('input[placeholder="Search"]').clear()

        // Type a search term that you expect to find results for
        cy.get('input[placeholder="Search"]').type(searchTitle)

        cy.get('[data-cy=services]')
          .should('have.length', 1)
          .contains(searchTitle)
      })

      it('show no result searched recent services', () => {
        const searchTitle = 'Sample text'

        cy.intercept(
          'GET',
          `${apiBaseUrl}/${orgSlug}/learner/services?service_view=recent&search=${searchTitle.replace(/ /g, '+')}`,
          {
            statusCode: 200,
            body: { data: [] }
          }
        ).as('getSearchRecentServices')

        cy.contains('h1', 'Your recent services')
          .siblings('a')
          .contains('See All')
          .click()

        cy.wait('@getRecentServices')

        cy.get('[data-cy=services]').should('have.length', 4)

        cy.get('input[placeholder="Search"]').clear()

        cy.get('input[placeholder="Search"]').type(searchTitle)

        cy.get('div').contains('No recent services')
      })
    })
  })
})
