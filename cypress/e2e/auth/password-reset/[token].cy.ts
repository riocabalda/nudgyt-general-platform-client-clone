import { HttpStatusCode } from 'axios'
import { apiUrl } from '../../../utils/api'

const DEVICES = ['Desktop', 'Mobile'] as const

/** Generic JWT from https://en.wikipedia.org/wiki/JSON_Web_Token */
const RESET_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9.gzSraSYS8EXBxLN _oWnFSRgCzcmJmMjLiuyu5CSpyHI='

/** Frontend code does not check if token string is actually a token... */
const INVALID_TOKEN = 'INVALID_TOKEN'

/** Should also have email query, but is not strictly needed... (see tests below) */
const PAGE_PATH = `/password-reset/${RESET_TOKEN}`

const SAMPLE_PASSWORD = {
  valid: '$rUwV96K',
  withoutUppercase: '$ruwv96k',
  withoutLowercase: '$RUWV96K',
  withoutNumber: '$rUwV?%K',
  withoutSpecial: '0rUwV96K'
}

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
      describe('URL reset token', () => {
        it('Cannot be accessed without a reset token', () => {
          cy.request({
            url: '/password-reset', // No token
            failOnStatusCode: false
          }).then((res) => {
            expect(res.status).to.eq(HttpStatusCode.NotFound)
          })
        })

        /**
         * Page does not discriminate between these
         * In fact, any sequence of characters allows access
         * However, only valid tokens actually complete the process (see tests below)
         */
        it.skip('Cannot be accessed with an invalid reset token', () => {})
        it.skip('Can be accessed with a valid reset token', () => {})
      })

      /**
       * Page functions without this
       * Frontend code reads email query, and sends it to the API,
       * but the API does not use it!
       *
       * Email is part of the reset token, and API extracts it from there
       */
      describe.skip('URL email query', () => {
        it('Cannot be accessed without an email query', () => {})
        it('Cannot be accessed with an invalid email query', () => {})
        it('Can be accessed with a valid email query', () => {})
      })

      describe('Navigation', () => {
        it('Can go back to sign-in page', () => {
          /** Click link back to login */
          cy.get('a').contains('Cancel').click()

          /** Verify current page */
          cy.url().should('include', '/sign-in')
          cy.get('button').contains('Log in').should('be.visible')
        })
      })
    })

    describe('Main elements', () => {
      it('Should have a main title', () => {
        cy.get('h1').contains('Reset your password').should('be.visible')
      })

      it('Should have a main password input', () => {
        cy.get('input#password[type=password]').should('be.visible')
      })

      it('Should have a password confirmation input', () => {
        cy.get('input#confirmPassword[type=password]').should('be.visible')
      })

      it('Should have a reset password button', () => {
        cy.get('button').contains('Reset password').should('be.visible')
      })

      it('Should have a link back to sign-in page', () => {
        cy.get('a')
          .contains('Cancel')
          .should('be.visible')
          .and('have.attr', 'href')
          .and('include', '/sign-in')
      })
    })

    /** Skipped in favor of similar testing in sign-in flow */
    describe.skip('Password visibility', () => {})

    /** Skipped in favor of similar testing in sign-up flow */
    describe.skip('Password validity', () => {})
    describe.skip('Password matching', () => {})

    describe('Reset token validity', () => {
      it('Should fail with invalid reset token', () => {
        const password = SAMPLE_PASSWORD.valid

        cy.visit(`/password-reset/${INVALID_TOKEN}`)

        cy.intercept('PATCH', apiUrl('/auth/reset-password'), {
          statusCode: HttpStatusCode.BadRequest,
          fixture: 'auth/reset-password/invalid-reset-token.json'
        }).as('reset-password')

        cy.get('input#password[type=password]').type(password)
        cy.get('input#confirmPassword[type=password]').type(password)
        cy.get('button').contains('Reset password').click()

        cy.wait('@reset-password')

        cy.contains('Invalid reset token.').should('be.visible')
      })

      /** Page path in `beforeEach()` block should already include valid token */
      it('Should succeed with valid reset token', () => {
        const password = SAMPLE_PASSWORD.valid

        cy.intercept('PATCH', apiUrl('/auth/reset-password'), {
          fixture: 'auth/reset-password/success.json'
        }).as('reset-password')

        cy.get('input#password[type=password]').type(password)
        cy.get('input#confirmPassword[type=password]').type(password)
        cy.get('button').contains('Reset password').click()

        cy.wait('@reset-password')

        cy.contains('Password reset successful!').should('be.visible')
      })
    })
  })
})
