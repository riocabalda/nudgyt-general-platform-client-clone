describe('Billing Page', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080) // 16:9 1080p display
  })
  it('Should be able to see Billing Nav', () => {
    cy.login('admin')

    cy.get('a').contains('Billing').should('exist')
  })

  it('Should access Billing Page', () => {
    cy.login('admin')

    cy.get('a').contains('Billing').click()

    cy.get('h1').contains('Billing period').should('be.visible')
  })

  it('Should access Invoices page', () => {
    cy.login('admin')

    cy.get('a').contains('Billing').click()

    cy.get('h1').contains('Billing period').should('exist')

    cy.get('button > a > p').contains('See All').click()

    cy.get('div.shadow-sm.rounded-none.lg\\:rounded-\\[8px\\]')
      .children('div')
      .should('have.length', 10)
  })
})
