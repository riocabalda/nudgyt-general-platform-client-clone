import { interceptLearnerServices } from '../../../support/utils/servicesInterceptors'
import { SortEnum } from '../../../support/utils/servicesFilters'

describe('Learner Recent Services', () => {
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

      it('should display filtered recent services', () => {
        cy.contains('h1', 'Your recent services')
          .siblings('a')
          .contains('See All')
          .click()
        cy.get('button').contains('Filter').click()

        // Newest
        cy.get('li > a').contains(SortEnum.NEWEST).click()
        cy.wait('@getRecentServicesNewest')
        cy.get('[data-cy="services"]').should('have.length', 4)
        cy.get('[data-cy="services"]')
          .first()
          .should('contain', 'Business Automation Solutions')
        cy.get('[data-cy="services"]')
          .last()
          .should('contain', 'Cloud Integration Services')

        // Oldest
        cy.get('li > a').contains(SortEnum.OLDEST).click()
        cy.wait('@getRecentServicesOldest')
        cy.get('[data-cy="services"]').should('have.length', 4)
        cy.get('[data-cy="services"]')
          .first()
          .should('contain', 'Cloud Integration Services')
        cy.get('[data-cy="services"]')
          .last()
          .should('contain', 'Business Automation Solutions')

        // Alphabetical
        cy.get('li > a').contains(SortEnum.ALPHABETICAL).click()
        cy.wait('@getRecentServicesAlphabetical')
        cy.get('[data-cy="services"]').should('have.length', 4)
        cy.get('[data-cy="services"]')
          .first()
          .should('contain', 'Business Automation Solutions')
        cy.get('[data-cy="services"]')
          .last()
          .should('contain', 'Financial Planning and Advisory')

        // // Most attempts
        cy.get('li > a').contains(SortEnum.MOST_ATTEMPTS).click()
        cy.wait('@getRecentServicesMostAttempts')
        cy.get('[data-cy="services"]').should('have.length', 4)
        cy.get('[data-cy="services"]')
          .first()
          .should('contain', 'Digital Marketing Solutions')
        cy.get('[data-cy="services"]')
          .last()
          .should('contain', 'Cloud Integration Services')

        // // Least attempts
        cy.get('li > a').contains(SortEnum.LEAST_ATTEMPTS).click()
        cy.wait('@getRecentServicesLeastAttempts')
        cy.get('[data-cy="services"]').should('have.length', 4)
        cy.get('[data-cy="services"]')
          .first()
          .should('contain', 'Cloud Integration Services')
        cy.get('[data-cy="services"]')
          .last()
          .should('contain', 'Digital Marketing Solutions')

        // Save simulation
        cy.get('li > a').contains(SortEnum.SAVED_SIMULATION).click()
        cy.wait('@getRecentServicesSavedSimulation')
        cy.get('[data-cy="services"]').should('have.length', 2)
        cy.get('[data-cy="services"]')
          .first()
          .should('contain', 'Business Automation Solutions')
        cy.get('[data-cy="services"]')
          .last()
          .should('contain', 'Digital Marketing Solutions')
      })
    })
  })
})
