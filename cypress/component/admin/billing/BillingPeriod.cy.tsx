import BillingPeriod from "@/app/[organization]/admin/billing/components/BillingPeriod"
import { mount } from "cypress/react18"

describe('BillingPeriod.cy.tsx', () => {
  beforeEach(() => {
    mount(<BillingPeriod />)
  })

  it('renders the billing period card correctly', () => {
    cy.get('.shadow-sm').should('exist')
    cy.get('h1').should('contain', 'Billing period')
    cy.get('p').should('contain', 'Yearly')
    cy.get('button').should('contain', 'Edit period')
  })

  it('has correct styling classes', () => {
    cy.get('.shadow-sm').should('have.class', 'rounded-none')
    cy.get('.shadow-sm').should('have.class', 'lg:rounded-[8px]')
    cy.get('button').should('have.class', 'min-w-[200px]')
  })
})