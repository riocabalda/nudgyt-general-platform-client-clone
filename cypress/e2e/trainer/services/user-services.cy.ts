import { interceptAdminServices } from '../../../support/utils/servicesInterceptors'
import mockServices from '../../../fixtures/admin/services/services.json'
import loggedInAdmin from '../../../fixtures/auth/me/success/trainer.json'

describe('Trainer User Services', () => {
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

      it('should display user services', () => {
        const userId = loggedInAdmin.data._id
        cy.intercept(
          'GET',
          `${Cypress.env('apiBaseUrl')}/${orgSlug}/admin/services?user_services=*`,
          {
            statusCode: 200,
            body: {
              data: mockServices.data.filter(
                (service) => service.creator._id === userId
              )
            }
          }
        ).as('getUserServices')

        cy.visit(`/${orgSlug}/admin/services`)

        cy.get('li > a').filter(':visible').contains('My Services').click()

        cy.get('[data-cy=services]').should('have.length', 1)
      })

      it('should handle no results found in user services', () => {
        const userId = '000000000000000000000000'
        cy.intercept(
          'GET',
          `${Cypress.env('apiBaseUrl')}/${orgSlug}/admin/services?user_services=*`,
          {
            statusCode: 200,
            body: {
              data: mockServices.data.filter(
                (service) => service.creator._id === userId
              )
            }
          }
        ).as('getUserServices')

        cy.visit(`/${orgSlug}/admin/services`)

        cy.get('li > a').filter(':visible').contains('My Services').click()

        cy.get('p').contains(/^(No services found|No services available)$/)
      })
    })
  })
})
