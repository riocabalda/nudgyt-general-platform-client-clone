import PopularServices from '@/app/[organization]/admin/usage/components/PopularServices'
import { mount } from 'cypress/react'

describe('PopularServices Component', () => {
  beforeEach(() => {
    mount(<PopularServices />)
  })

  it('renders the component title', () => {
    cy.contains('Popular Services').should('exist')
  })

  it('displays table headers', () => {
    cy.contains('Service').should('exist')
    cy.contains('Learners').should('exist')
  })

  it('displays all services with correct data', () => {
    cy.get('.grid').within(() => {
      // Test first service
      cy.contains('Magna amet magna volutpat nec ut rutrum').should('exist')
      cy.contains('218').should('exist')

      // Test last service
      cy.contains('Eget turpis sed eu etiam ultricies').should('exist')
      cy.contains('145').should('exist')
    })
  })
})
