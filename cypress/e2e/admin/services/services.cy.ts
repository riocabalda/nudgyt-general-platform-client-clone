import mockServices from '../../../fixtures/admin/services/services.json'

describe('Admin Services Page Access', () => {
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

        cy.intercept('GET', `${apiBaseUrl}/${orgSlug}/admin/services?`, {
          statusCode: 200,
          body: mockServices
        }).as('getServices')

        cy.visit(`/${orgSlug}/admin/services`)
      })

      it('can access admin services', () => {
        cy.get('h1').should('be.visible').contains('Services')
        cy.get('[data-cy=services]').should('have.lengthOf', 3)
      })
    })
  })
})
