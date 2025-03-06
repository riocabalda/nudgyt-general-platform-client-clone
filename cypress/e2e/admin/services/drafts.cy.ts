import { interceptAdminServices } from '../../../support/utils/servicesInterceptors'
import { filterServices } from '../../../support/utils/servicesFilters'
import mockServices from '../../../fixtures/admin/services/services.json'

describe('Admin Draft Services', () => {
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

        cy.assumeLogin('admin')
        interceptAdminServices(orgSlug)
      })

      it('should display draft services', () => {
        cy.intercept(
          'GET',
          `${apiBaseUrl}/${orgSlug}/admin/services?is_published=false`,
          {
            statusCode: 200,
            body: {
              data: filterServices(
                mockServices.data as any,
                false,
                'is_published'
              )
            }
          }
        ).as('getDraftServices')

        cy.visit(`/${orgSlug}/admin/services`)

        if (device === 'Desktop') cy.get('li > a').contains('Drafts').click()
        if (device === 'Mobile')
          cy.get('a[href="/' + orgSlug + '/admin/services?is_published=false"]')
            .last()
            .click()

        cy.get('[data-cy=services]').should('have.length', 1)
      })

      it('should handle no results found in draft services', () => {
        cy.intercept(
          'GET',
          `${apiBaseUrl}/${orgSlug}/admin/services?is_published=false`,
          {
            statusCode: 200,
            body: {
              data: []
            }
          }
        ).as('getDraftServices')

        cy.visit(`/${orgSlug}/admin/services`)

        if (device === 'Desktop')
          cy.get('li > a').contains('Drafts').first().click()
        if (device === 'Mobile')
          cy.get('a[href="/' + orgSlug + '/admin/services?is_published=false"]')
            .last()
            .click()

        cy.get('p').contains(/^(No services found|No services available)$/)
      })
    })
  })
})
