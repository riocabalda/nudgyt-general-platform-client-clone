describe('Usage Page', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080) // 16:9 1080p display
  })

  describe('Learner Access', () => {
    it('Should not be able to see Usage Nav', () => {
      cy.login('learner')

      cy.get('a').contains('Usage').should('not.exist')
    })
  })

  describe('Admin Access', () => {
    it('Should be able to see Usage Nav', () => {
      cy.login('admin')

      cy.get('a').contains('Usage').should('exist')
    })

    it('Should access Usage Page', () => {
      cy.login('admin')

      cy.get('a').contains('Usage').click()

      cy.get('h1').contains('Popular Services').should('be.visible')
    })

    it('Should be able to see Usage Nav', () => {
      cy.login('admin')

      cy.get('a').contains('Usage').should('exist')
    })

    it('Should navigate between tabs', () => {
      cy.login('admin')

      cy.get('a').contains('Usage').click()

      cy.get('h1').contains('Popular Services').should('exist')

      cy.get('th').contains('Last Service Used').should('exist')
      cy.get('th').contains('Creator').should('not.exist')

      cy.get('button').contains('Services').click()

      cy.get('th').contains('Last Service Used').should('not.exist')
      cy.get('th').contains('Creator').should('exist')
    })
  })
})
