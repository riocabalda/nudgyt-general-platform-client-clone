describe('Sample Dashboard Access', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080) // 16:9 1080p display
  })

  it('Can access learner dashboard', () => {
    cy.login('learner')

    /** Dashboard header */
    cy.get('h1').should('be.visible').contains('Dashboard')

    /** Sidebar contains name */
    cy.get('aside').contains('Sample User').should('be.visible')

    /** Sidebar contains role */
    cy.get('aside').contains('Learner').should('be.visible')
  })
})
