import PaymentMethod from "@/app/[organization]/admin/billing/components/PaymentMethod"
import { mount } from "cypress/react18"

describe('PaymentMethod.cy.tsx', () => {
  beforeEach(() => {
    mount(<PaymentMethod />)
  })

  it('renders payment method information correctly', () => {
    cy.get('h1').should('contain', 'Payment method')
    cy.get('p').first().should('contain', 'Credit Card')
    cy.get('p').last().should('contain', 'MasterCard ending in 1801')
  })

  it('has edit button with correct styling', () => {
    cy.get('button').should('contain', 'Edit method')
    cy.get('button').should('have.class', 'min-w-[200px]')
  })
})