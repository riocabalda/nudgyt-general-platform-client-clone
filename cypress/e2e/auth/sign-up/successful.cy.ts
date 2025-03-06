import { HttpStatusCode } from 'axios'
import { apiUrl } from '../../../utils/api'

const DEVICES = ['Desktop', 'Mobile'] as const

const INVALID_EMAIL = 'invalid@email'
const VALID_EMAIL = 'valid@email.com'

const PAGE_PATH = `/sign-up/successful?${new URLSearchParams({ email: VALID_EMAIL })}`

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
      /** Page can be accessed regardless of email query */
      describe.skip('URL email query', () => {
        it('Cannot be accessed without an email query', () => {})
        it('Cannot be accessed with an invalid email query', () => {})
        it('Can be accessed with a valid email query', () => {})
      })

      it('Can go back to sign-in page', () => {
        cy.get('a').contains('Log in').click()

        cy.url().should('include', '/sign-in')
        cy.get('button').contains('Log in').should('be.visible')
      })
    })

    describe('Main elements', () => {
      it('Should have a main title', () => {
        cy.get('h1')
          .contains('You have successfully signed up!')
          .should('be.visible')
      })

      it('Should have a resend confirmation button', () => {
        cy.get('button').contains('Resend confirmation').should('be.visible')
      })

      it('Should have a link back to sign-in page', () => {
        cy.get('a[href="/sign-in"]').contains('Log in').should('be.visible')
      })

      it("Should not show the user's email", () => {
        cy.contains(VALID_EMAIL).should('not.exist')
      })
    })

    describe('Resending confirmation email', () => {
      it('Should fail without an email query', () => {
        const message = 'An error occurred.'

        cy.visit('/sign-up/successful') // No email query

        cy.contains(message).should('not.exist')

        cy.intercept('POST', apiUrl('/auth/resend-email-verification'), {
          statusCode: HttpStatusCode.BadRequest,
          fixture: 'auth/resend-email-verification/invalid-email.json'
        }).as('resend-email-verification')

        cy.get('button').contains('Resend confirmation').click()

        cy.wait('@resend-email-verification')

        cy.contains(message).should('be.visible')
      })

      it('Should fail with an invalid email query', () => {
        const message = 'An error occurred.'

        cy.visit(
          `/sign-up/successful?${new URLSearchParams({ email: INVALID_EMAIL })}`
        )

        cy.contains(message).should('not.exist')

        cy.intercept('POST', apiUrl('/auth/resend-email-verification'), {
          statusCode: HttpStatusCode.BadRequest,
          fixture: 'auth/resend-email-verification/invalid-email.json'
        }).as('resend-email-verification')

        cy.get('button').contains('Resend confirmation').click()

        cy.wait('@resend-email-verification')

        cy.contains(message).should('be.visible')
      })

      it('Should succeed with a registered email', () => {
        const message = 'Verification email sent!'

        cy.contains(message).should('not.exist')

        cy.intercept('POST', apiUrl('/auth/resend-email-verification'), {
          fixture: 'auth/resend-email-verification/success.json'
        }).as('resend-email-verification')

        cy.get('button').contains('Resend confirmation').click()

        cy.wait('@resend-email-verification')

        cy.contains(message).should('be.visible')
        cy.get('button[disabled]')
          .contains(/Resend in \d\d?s/)
          .should('be.visible')
      })
    })
  })
})
