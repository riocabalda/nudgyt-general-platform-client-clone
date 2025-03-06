import { interceptAdminServices } from '../../../support/utils/servicesInterceptors'
import { filterServices } from '../../../support/utils/servicesFilters'
import mockServices from '../../../fixtures/admin/services/services.json'

describe('Trainer Published Services', () => {
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

        cy.assumeLogin('trainer')
        interceptAdminServices(orgSlug)
      })
      it('should display published services', () => {
        cy.intercept(
          'GET',
          `${apiBaseUrl}/${orgSlug}/admin/services?is_published=true`,
          {
            statusCode: 200,
            body: {
              data: filterServices(
                mockServices.data as any,
                true,
                'is_published'
              )
            }
          }
        ).as('getPublishedServices')

        cy.visit(`/${orgSlug}/admin/services`)

        cy.get('li > a').filter(':visible').contains('Published').click()

        cy.get('[data-cy=services]').should('have.length', 2)
      })

      it('should handle no results found in published services', () => {
        cy.intercept(
          'GET',
          `${apiBaseUrl}/${orgSlug}/admin/services?is_published=true`,
          {
            statusCode: 200,
            body: {
              data: []
            }
          }
        ).as('getPublishedServices')

        cy.visit(`/${orgSlug}/admin/services`)

        cy.get('li > a').filter(':visible').contains('Published').click()

        cy.get('p').contains(/^(No services found|No services available)$/)
      })
    })
  })
})
