import { HttpStatusCode } from 'axios'
import { apiUrl } from '../../utils/api'

const DEVICES = ['Desktop', 'Mobile'] as const
const PAGE_PATH = '/forgot-password'

const LINK_TEXT = 'Forgot password?'
const PAGE_TITLE = 'Forgot password?'

const EMAIL_PLACEHOLDER = 'example@email.com'

const INVALID_EMAIL = 'invalid@email'
const UNREGISTERED_EMAIL = 'nonexistent@user.com'
const VALID_EMAIL = 'existing@user.com'

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
      it('Can be accessed from sign-in page', () => {
        /** Start from sign in page */
        cy.visit('/sign-in')

        /** Check if link is present */
        cy.get('a')
          .contains(LINK_TEXT)
          .should('have.attr', 'href')
          .and('include', PAGE_PATH)

        /** Actually click the link */
        cy.get('a').contains(LINK_TEXT).click()

        /** Verify current page */
        cy.url().should('include', PAGE_PATH)
        cy.get('h1').contains(PAGE_TITLE).should('be.visible')
      })

      it('Can go back to sign-in page', () => {
        /** Click link back to login */
        cy.get('a').contains('Back to login').click()

        /** Verify current page */
        cy.url().should('include', '/sign-in')
        cy.get('button').contains('Log in').should('be.visible')
      })
    })

    describe('Main elements', () => {
      it('Should have a main title', () => {
        cy.get('h1').contains(PAGE_TITLE).should('be.visible')
      })

      it('Should have an email field', () => {
        cy.get('input#email')
          .should('have.attr', 'type', 'email')
          .should('have.attr', 'placeholder', EMAIL_PLACEHOLDER)
      })

      it('Should have a reset button', () => {
        cy.get('button').should('contain.text', 'Reset password')
      })

      it('Should have a link back to login', () => {
        cy.get('a')
          .contains('Back to login')
          .should('have.attr', 'href')
          .and('include', '/sign-in')
      })
    })

    describe('Password resetting', () => {
      it('Should fail with an invalid email', () => {
        const message = 'Invalid email address'

        cy.contains(message).should('not.exist') // Should not be visible yet

        cy.get('input#email').type(INVALID_EMAIL)
        cy.get('button').contains('Reset password').click()

        cy.contains(message).should('be.visible')
      })

      it('Should fail with an unregistered email', () => {
        const message = 'Email not found'

        cy.intercept('POST', apiUrl('/auth/forgot-password'), {
          statusCode: HttpStatusCode.NotFound,
          fixture: 'auth/forgot-password/email-not-found.json'
        }).as('forgot-password')

        cy.contains(message).should('not.exist') // Should not be visible yet

        cy.get('input#email').type(UNREGISTERED_EMAIL)
        cy.get('button').contains('Reset password').click()

        cy.contains(message).should('be.visible')
      })

      it('Should succeed with an existing user', () => {
        const message = 'We have emailed your password reset link.'

        cy.contains(message).should('not.exist') // Should not be visible yet

        cy.intercept('POST', apiUrl('/auth/forgot-password'), {
          fixture: 'auth/forgot-password/success.json'
        }).as('forgot-password')

        cy.get('input#email').type(VALID_EMAIL)
        cy.get('button').contains('Reset password').click()

        cy.wait('@forgot-password')

        cy.contains(message).should('be.visible')

        cy.get('input#email').should('have.value', '') // Should be cleared on success
      })
    })
  })
})
