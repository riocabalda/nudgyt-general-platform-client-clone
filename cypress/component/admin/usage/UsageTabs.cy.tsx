import UsageTabs from '@/app/[organization]/admin/usage/components/UsageTabs'
import { AppRouterProvider } from '@/cypress/support/providers'
import { mount } from 'cypress/react18'

describe('UsageTabs Component', () => {
  beforeEach(() => {
    cy.viewport(1200, 800)

    cy.document().then((document) => {
      const portalRoot = document.createElement('div')
      portalRoot.setAttribute('id', 'radix-portal')
      document.body.appendChild(portalRoot)
    })

    mount(
      <AppRouterProvider>
        <UsageTabs />
      </AppRouterProvider>
    )

    cy.get('[role="tablist"]').should('exist')
  })

  it('renders both tabs', () => {
    cy.get('[role="tab"]').should('have.length', 2)
    cy.get('[role="tab"]').eq(0).should('contain', 'Learners')
    cy.get('[role="tab"]').eq(1).should('contain', 'Services')
  })
})
