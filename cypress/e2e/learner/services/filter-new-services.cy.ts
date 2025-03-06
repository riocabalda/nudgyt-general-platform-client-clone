import { interceptLearnerServices } from '../../../support/utils/servicesInterceptors'
import { SortEnum } from '../../../support/utils/servicesFilters'

describe('Learner New Services', () => {
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

      it('should display filtered new services', () => {
        cy.contains('h1', 'New services')
          .siblings('a')
          .contains('See All')
          .click()
        cy.get('button').contains('Filter').click()

        // Newest
        cy.get('li > a').contains(SortEnum.NEWEST).click()
        cy.wait('@getNewServicesNewest')
        cy.get('[data-cy="services"]').should('have.length', 4)
        cy.get('[data-cy="services"]')
          .first()
          .should('contain', 'Graphic Design and Branding Services')
        cy.get('[data-cy="services"]')
          .last()
          .should('contain', 'Web and App Development')

        // Oldest
        cy.get('li > a').contains(SortEnum.OLDEST).click()
        cy.wait('@getNewServicesOldest')
        cy.get('[data-cy="services"]').should('have.length', 4)
        cy.get('[data-cy="services"]')
          .first()
          .should('contain', 'Web and App Development')
        cy.get('[data-cy="services"]')
          .last()
          .should('contain', 'Graphic Design and Branding Services')

        // Alphabetical
        cy.get('li > a').contains(SortEnum.ALPHABETICAL).click()
        cy.wait('@getNewServicesAlphabetical')
        cy.get('[data-cy="services"]').should('have.length', 4)
        cy.get('[data-cy="services"]')
          .first()
          .should('contain', 'Customer Support Outsourcing')
        cy.get('[data-cy="services"]')
          .last()
          .should('contain', 'Web and App Development')

        // // Most attempts
        cy.get('li > a').contains(SortEnum.MOST_ATTEMPTS).click()
        cy.wait('@getNewServicesMostAttempts')
        cy.get('[data-cy="services"]').should('have.length', 4)
        cy.get('[data-cy="services"]')
          .first()
          .should('contain', 'Customer Support Outsourcing')
        cy.get('[data-cy="services"]')
          .last()
          .should('contain', 'Web and App Development')

        // // Least attempts
        cy.get('li > a').contains(SortEnum.LEAST_ATTEMPTS).click()
        cy.wait('@getNewServicesLeastAttempts')
        cy.get('[data-cy="services"]').should('have.length', 4)
        cy.get('[data-cy="services"]')
          .first()
          .should('contain', 'Web and App Development')
        cy.get('[data-cy="services"]')
          .last()
          .should('contain', 'Customer Support Outsourcing')

        // Save simulation
        cy.get('li > a').contains(SortEnum.SAVED_SIMULATION).click()
        cy.wait('@getNewServicesSavedSimulation')
        cy.get('[data-cy="services"]').should('have.length', 1)
        cy.get('[data-cy="services"]')
          .first()
          .should('contain', 'Customer Support Outsourcing')
        cy.get('[data-cy="services"]')
          .last()
          .should('contain', 'Customer Support Outsourcing')
      })
    })
  })
})
