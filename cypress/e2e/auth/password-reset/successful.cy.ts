/**
 * Marks this file as a module,
 * so TypeScript will not assume its contents are available in other files
 *
 * REMOVE IF ANYTHING IS IMPORTED INTO THIS FILE
 *
 * https://github.com/microsoft/TypeScript/issues/18232#issuecomment-327285710
 */
export {}

const DEVICES = ['Desktop', 'Mobile'] as const
const PAGE_PATH = '/password-reset/successful'

DEVICES.forEach((device) => {
  describe(device, () => {
    beforeEach(() => {
      cy.visit(PAGE_PATH)

      if (device === 'Desktop') {
        cy.viewport(1920, 1080) // 16:9 1080p display
      }
      if (device === 'Mobile') {
        cy.viewport('iphone-se2')
      }
    })

    describe('Page access', () => {
      it('Can go back to sign-in page', () => {
        /** Click link back to login */
        cy.get('a').contains('Login').click()

        /** Verify current page */
        cy.url().should('include', '/sign-in')
        cy.get('button').contains('Log in').should('be.visible')
      })
    })

    describe('Main elements', () => {
      it('Should have a main title', () => {
        cy.get('h1').contains('Password reset successful!').should('be.visible')
      })

      it('Should have a link back to sign-in page', () => {
        cy.get('a')
          .contains('Login')
          .should('be.visible')
          .and('have.attr', 'href')
          .and('include', '/sign-in')
      })
    })
  })
})
