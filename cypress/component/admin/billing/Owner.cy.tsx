import Owner from "@/app/[organization]/admin/billing/components/Owner"
import { mount } from "cypress/react18"

describe('Owner.cy.tsx', () => {
  beforeEach(() => {
    mount(<Owner />)
  })

  it('renders owner information correctly', () => {
    cy.get('h1').should('contain', 'Billed to')
    cy.get('p').should('have.length', 3)
    cy.get('p').eq(0).should('contain', 'Hand McLean')
    cy.get('p').eq(1).should('contain', 'Kapitolyo')
    cy.get('p').eq(2).should('contain', 'hank_mclean@vaultec.com')
  })

  it('has edit button with correct styling', () => {
    cy.get('button').should('contain', 'Edit information')
    cy.get('button').should('have.class', 'min-w-[200px]')
  })
})