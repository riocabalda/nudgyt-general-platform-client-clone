import ServicesTab from '@/app/[organization]/admin/usage/components/tabs/ServicesTab'
import { AppRouterProvider } from '@/cypress/support/providers'
import { mount } from 'cypress/react'

describe('LearnersTab Component', () => {
  const mockActionItems = [
    <div key='search' data-testid='search'>
      Search
    </div>
  ]

  beforeEach(() => {
    mount(
      <AppRouterProvider>
        <ServicesTab actionItems={mockActionItems} />
      </AppRouterProvider>
    )
  })

  it('renders the pagination component', () => {
    // Check for individual pagination values instead of a combined string
    cy.contains('1').should('exist') // from
    cy.contains('10').should('exist') // to
    cy.contains('1,000').should('exist') // total
  })

  it('displays table headers', () => {
    cy.contains('Name').should('exist')
    cy.contains('Usage Hours').should('exist')
    cy.contains('Created').should('exist')
    cy.contains('Creator').should('exist')
    cy.contains('Learners').should('exist')
  })

  it('displays service data correctly', () => {
    cy.contains('Learning Path A').should('exist')
    cy.contains('08:45:30').should('exist')
    cy.contains('John Smith').should('exist')
    cy.get('tbody tr').should('have.length', 3)
  })

  it('renders action items', () => {
    cy.get('[data-testid="search"]').should('exist')
  })
})
