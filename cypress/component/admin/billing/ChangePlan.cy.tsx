import ChangePlan from "@/app/[organization]/admin/billing/components/ChangePlan"
import { mount } from "cypress/react18"

describe('ChangePlan.cy.tsx', () => {
  beforeEach(() => {
    mount(<ChangePlan />)
  })

  it('renders the plan information correctly', () => {
    cy.get('.text-xl').should('contain', 'This workspace is on the')
    cy.get('.text-xl').should('contain', 'Organization Tier')
  })

  it('displays all feature list items', () => {
    cy.get('ul li').should('have.length', 3)
    cy.get('ul li').first().should('contain', 'Access to Course Documents')
    cy.get('ul li').eq(1).should('contain', 'Access to all Simulations')
    cy.get('ul li').last().should('contain', '360 minutes')
  })

  it('has the correct button styling', () => {
    cy.get('button').should('have.class', 'w-full')
    cy.get('button').should('contain', 'Change plan')
  })
})