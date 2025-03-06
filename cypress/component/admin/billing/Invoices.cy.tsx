import Invoices from "@/app/[organization]/admin/billing/components/Invoices"
import { mount } from "cypress/react18"

describe('Invoices.cy.tsx', () => {
  beforeEach(() => {
    mount(<Invoices />)
  })

  it('renders the header correctly', () => {
    cy.get('h1').should('contain', 'Invoices')
    cy.get('a').should('contain', 'See All')
  })

  it('displays correct number of invoice items', () => {
    cy.get('.shadow-sm > div').should('have.length', 6) // First 6 invoices
  })

  it('formats invoice information correctly', () => {
    cy.get('.shadow-sm > div').first().within(() => {
      cy.get('p').first().should('contain', 'Upcoming')
    })

    cy.get('.shadow-sm > div').eq(1).within(() => {
      cy.get('p').first().should('contain', 'November 15, 2024')
      cy.get('p').last().should('contain', 'USD 200')
    })
  })

  it('alternates background colors for rows', () => {
    cy.get('.shadow-sm > div').eq(1).should('have.class', 'bg-neutral-100')
    cy.get('.shadow-sm > div').eq(3).should('have.class', 'bg-neutral-100')
  })
})