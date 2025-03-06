import {
  interceptAdminSearchServices,
  interceptAdminServices
} from '../../../support/utils/servicesInterceptors'

describe('Admin Search Services', () => {
  const DEVICES = ['Desktop', 'Mobile']
  const orgSlug = 'public'

  DEVICES.forEach((device) => {
    context(device, () => {
      beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.assumeLogin('admin')

        interceptAdminServices(orgSlug)
      })

      it('should display results when searching for a valid term', () => {
        const searchTitle = 'Body Builder Mr Singapore'

        interceptAdminSearchServices(orgSlug, searchTitle)

        cy.visit(`/${orgSlug}/admin/services`)

        // Clear search input if there's any existing text
        cy.get('input[placeholder="Search"]').clear()

        // Type a search term that you expect to find results for
        cy.get('input[placeholder="Search"]').type(searchTitle)

        cy.get('[data-cy=services]').should('have.length', 1)
      })

      it('should handle no results found', () => {
        const searchTitle = 'Sample Title'
        interceptAdminSearchServices(orgSlug, searchTitle)

        cy.visit(`/${orgSlug}/admin/services`)

        // Clear search input if there's any existing text
        cy.get('input[placeholder="Search"]').clear()

        cy.get('input[placeholder="Search"]').type(searchTitle)

        cy.get('[data-cy=services]').should('have.length', 0)
      })
    })
  })
})
