import MetricSection from '@/app/[organization]/admin/usage/components/MetricSection'
import { mount } from 'cypress/react'

describe('MetricSection Component', () => {
  beforeEach(() => {
    mount(<MetricSection />)
  })

  it('renders the date filter select', () => {
    cy.get('button').should('exist')
  })

  it('displays all date filter options', () => {
    cy.get('button').click()
    cy.contains('Today').should('exist')
    cy.contains('Yesterday').should('exist')
    cy.contains('Last 7 days').should('exist')
    cy.contains('Last 30 days').should('exist')
    cy.contains('This year').should('exist')
  })

  it('displays all metrics', () => {
    cy.contains('TOTAL USAGE').should('exist')
    cy.contains('80:00:00').should('exist')
    cy.contains('AVERAGE USAGE PER SESSION').should('exist')
    cy.contains('00:30:00').should('exist')
  })
})
