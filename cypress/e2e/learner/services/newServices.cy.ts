import { interceptLearnerServices } from '../../../support/utils/servicesInterceptors'
import { filterServices } from '../../../support/utils/servicesFilters'
import newServicesData from '../../../fixtures/learner/services/newServices.json'

describe('Learner new Services', () => {
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

      it('show new services', () => {
        cy.contains('h1', 'New services')
          .siblings('a')
          .contains('See All')
          .click()

        cy.wait('@getNewServices')

        cy.get('[data-cy=services]').should('have.length', 4)

        cy.get('[data-cy=services]').each(($div, index) => {
          const service = newServicesData.data[index]
          cy.wrap($div).should('contain.text', service?.title)
        })
      })

      it('no new services', () => {
        cy.intercept(
          'GET',
          `${apiBaseUrl}/${orgSlug}/learner/services?service_view=new`,
          {
            statusCode: 200,
            body: { data: [] }
          }
        ).as('getNewServices')

        cy.contains('h1', 'New services')
          .siblings('a')
          .contains('See All')
          .click()

        cy.get('div').contains('No new services')
      })

      it('show searched new services', () => {
        const searchTitle = 'IT Security Services'

        cy.intercept(
          'GET',
          `${apiBaseUrl}/${orgSlug}/learner/services?service_view=new&search=${searchTitle.replace(/ /g, '+')}`,
          {
            statusCode: 200,
            body: { data: filterServices(newServicesData.data as any, searchTitle) }
          }
        ).as('getSearchNewServices')

        cy.contains('h1', 'New services')
          .siblings('a')
          .contains('See All')
          .click()

        cy.get('[data-cy=services]').should('have.length', 4)

        cy.get('input[placeholder="Search"]').clear()

        // Type a search term that you expect to find results for
        cy.get('input[placeholder="Search"]').type(searchTitle)

        cy.wait('@getSearchNewServices')

        cy.get('[data-cy=services]')
          .should('have.length', 1)
          .contains(searchTitle)
      })

      it('show no result searched new services', () => {
        const searchTitle = 'Sample text'

        cy.intercept(
          'GET',
          `${apiBaseUrl}/${orgSlug}/learner/services?service_view=new&search=${searchTitle.replace(/ /g, '+')}`,
          {
            statusCode: 200,
            body: { data: [] }
          }
        ).as('getSearchNewServices')

        cy.contains('h1', 'New services')
          .siblings('a')
          .contains('See All')
          .click()

        cy.get('[data-cy=services]').should('have.length', 4)

        cy.get('input[placeholder="Search"]').clear()

        cy.get('input[placeholder="Search"]').type(searchTitle)

        cy.wait('@getSearchNewServices')

        cy.get('div').contains('No new services')
      })
    })
  })
})
