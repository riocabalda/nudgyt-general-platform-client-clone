import LearnersTab from '@/app/[organization]/admin/usage/components/tabs/LearnersTab'
import { AppRouterProvider } from '@/cypress/support/providers'
import { mount } from 'cypress/react18'

describe('LearnersTab Component', () => {
  const mockActionItems = [
    <div key='search' data-testid='search'>
      Search
    </div>
  ]

  beforeEach(() => {
    mount(
      <AppRouterProvider>
        <LearnersTab actionItems={mockActionItems} />
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
    cy.contains('Joined').should('exist')
    cy.contains('Email Address').should('exist')
    cy.contains('Last Service Used').should('exist')
    cy.contains('Services').should('exist')
  })

  it('displays learner data correctly', () => {
    cy.contains('John Doe').should('exist')
    cy.contains('08:45:30').should('exist')
    cy.contains('johndoe@example.com').should('exist')
    cy.get('tbody tr').should('have.length', 20)
  })

  it('renders action items', () => {
    cy.get('[data-testid="search"]').should('exist')
  })
})
