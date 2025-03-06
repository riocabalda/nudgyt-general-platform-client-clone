import { SortEnum } from '../../../support/utils/servicesFilters'
import {
  interceptAdminServices,
  interceptSortedServices
} from '../../../support/utils/servicesInterceptors'

describe('Admin Sort Services', () => {
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

      it('should display sorted services', () => {
        interceptSortedServices(orgSlug)

        cy.visit(`/${orgSlug}/admin/services`)

        if (device === 'Desktop')
          cy.get('button > p').contains('Filter').click()
        if (device === 'Mobile') {
          cy.get('div > button > svg.lucide-ellipsis').click()
          cy.get('li > button > div').contains('Filter').click()
        }

        // Newest
        cy.get('li > a').contains(SortEnum.NEWEST).click()
        cy.wait('@getNewestServices')
        cy.get('[data-cy="services"]').should('have.length', 3)
        cy.get('[data-cy="services"]')
          .first()
          .should('contain', 'Emilio the Sexist Businessman')

        // Oldest
        cy.get('li > a').contains(SortEnum.OLDEST).click()
        cy.wait('@getOldestServices')
        cy.get('[data-cy="services"]').should('have.length', 3)
        cy.get('[data-cy="services"]')
          .first()
          .should('contain', 'A Mother’s Day to Day')

        // Alphabetical
        cy.get('li > a').contains(SortEnum.ALPHABETICAL).click()
        cy.wait('@getAlphabeticalServices')
        cy.get('[data-cy="services"]').should('have.length', 3)
        cy.get('[data-cy="services"]')
          .first()
          .should('contain', 'A Mother’s Day to Day')
        cy.get('[data-cy="services"]')
          .last()
          .should('contain', 'Emilio the Sexist Businessman')

        if (device === 'Desktop') {
          // Most attempts
          cy.get('li > a').contains(SortEnum.MOST_ATTEMPTS).click()
          cy.wait('@getMostAttemptsServices')
          cy.get('[data-cy="services"]').should('have.length', 3)
          cy.get('[data-cy="services"]')
            .first()
            .should('contain', 'Body Builder Mr Singapore')
          cy.get('[data-cy="services"]')
            .last()
            .should('contain', 'A Mother’s Day to Day')

          // Least attempts
          cy.get('li > a').contains(SortEnum.LEAST_ATTEMPTS).click()
          cy.wait('@getLeastAttemptsServices')
          cy.get('[data-cy="services"]').should('have.length', 3)
          cy.get('[data-cy="services"]')
            .first()
            .should('contain', 'A Mother’s Day to Day')
          cy.get('[data-cy="services"]')
            .last()
            .should('contain', 'Body Builder Mr Singapore')
        }
        if (device === 'Mobile') {
          // Latest attempts fist
          cy.get('li > a').contains(SortEnum.LATEST_ATTEMPTS).click()
          cy.wait('@getLatestAttemptsServices')
          cy.get('[data-cy="services"]').should('have.length', 3)
          cy.get('[data-cy="services"]')
            .first()
            .should('contain', 'Body Builder Mr Singapore')
          cy.get('[data-cy="services"]')
            .last()
            .should('contain', 'A Mother’s Day to Day')
        }
      })
    })
  })
})
