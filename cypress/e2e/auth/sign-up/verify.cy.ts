import { HttpStatusCode } from 'axios'
import { apiUrl } from '../../../utils/api'

const DEVICES = ['Desktop', 'Mobile'] as const

/** Only verification token query is actually needed */
function loadPage(params?: {
  verificationToken?: string | null
  role?: 'Learner' | 'Trainer' | 'Admin' | null
}) {
  const {
    /** Generic hash from https://en.wikipedia.org/wiki/Bcrypt */
    verificationToken = '$2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW',
    role = null
  } = params ?? {}

  const paramsObj = new URLSearchParams()

  if (verificationToken !== null) {
    paramsObj.append('verification_token', verificationToken)
  }

  if (role !== null) {
    paramsObj.append('role', role)
  }

  const pagePath = `/sign-up/verify?${paramsObj}`
  cy.visit(pagePath)
}

DEVICES.forEach((device) => {
  describe(device, () => {
    beforeEach(() => {
      loadPage()

      if (device === 'Desktop') {
        cy.viewport(1920, 1080) // 16:9 1080p display
      }
      if (device === 'Mobile') {
        cy.viewport('iphone-se2')
      }
    })

    describe('Page access', () => {
      describe('URL verification token query', () => {
        it('Cannot be accessed without a verification token', () => {
          const message =
            'Your verification link is invalid or expired. Please request a new one.'

          cy.intercept('POST', apiUrl('/auth/verify-email'), {
            statusCode: HttpStatusCode.BadRequest,
            fixture: 'auth/verify-email/verification-link-invalid.json'
          }).as('verify-email')

          loadPage({ verificationToken: null }) // No token

          cy.get('h1').contains(message).should('be.visible')
        })

        it('Cannot be accessed with an invalid verification token', () => {
          const message =
            'Your verification link is invalid or expired. Please request a new one.'
          const INVALID_TOKEN = '1234'

          cy.intercept('POST', apiUrl('/auth/verify-email'), {
            statusCode: HttpStatusCode.BadRequest,
            fixture: 'auth/verify-email/verification-link-invalid.json'
          }).as('verify-email')

          loadPage({ verificationToken: INVALID_TOKEN })

          cy.get('h1').contains(message).should('be.visible')
        })

        it('Can be accessed with a valid verification token', () => {
          cy.intercept('POST', apiUrl('/auth/verify-email'), {
            fixture: 'auth/verify-email/success.json'
          }).as('verify-email')

          cy.get('h1').contains('Verification Complete').should('be.visible')
        })
      })

      /**
       * Page can be accessed without role query
       * Frontend code defaults to Admin/Trainer behavior
       */
      describe.skip('URL role query', () => {
        it('Cannot be accessed with incorrect role query', () => {})
        it('Can be accessed with correct role query', () => {})
      })

      /**
       * Happens when verification token is already used,
       * or when verification link is visited twice (e.g. refresh)
       */
      it('Should error if account is already verified', () => {
        const message = 'Account is already verified.'

        cy.intercept('POST', apiUrl('/auth/verify-email'), {
          statusCode: HttpStatusCode.BadRequest,
          fixture: 'auth/verify-email/already-verified.json'
        }).as('verify-email')

        cy.get('h1').contains(message).should('be.visible')
      })
    })

    describe('Main elements', () => {
      describe('Learner', () => {
        beforeEach(() => {
          cy.intercept('POST', apiUrl('/auth/verify-email'), {
            fixture: 'auth/verify-email/success.json'
          }).as('verify-email')

          loadPage({ role: 'Learner' })
        })

        it('Should have a main title', () => {
          cy.get('h1').contains('Verification Complete').should('be.visible')
        })

        it('Should show approved message', () => {
          const message =
            'Success! Your account has been verified. You can now log in to your account.'

          cy.contains(message).should('be.visible')
        })

        it('Should have a link back to sign-in page', () => {
          cy.get('a').contains('Login').should('be.visible')
        })
      })

      describe('Trainer', () => {
        beforeEach(() => {
          cy.intercept('POST', apiUrl('/auth/verify-email'), {
            fixture: 'auth/verify-email/success.json'
          }).as('verify-email')

          loadPage({ role: 'Trainer' })
        })

        it('Should have a main title', () => {
          cy.get('h1').contains('Verification Complete').should('be.visible')
        })

        it('Should show approving notice', () => {
          const message =
            'An Admin is now approving your account. You will be sent an email once your account has been approved.'

          cy.contains(message).should('be.visible')
        })

        it('Should have a link back to sign-in page', () => {
          cy.get('a').contains('Back to login').should('be.visible')
        })
      })

      describe('Admin', () => {
        beforeEach(() => {
          cy.intercept('POST', apiUrl('/auth/verify-email'), {
            fixture: 'auth/verify-email/success.json'
          }).as('verify-email')

          loadPage({ role: 'Admin' })
        })

        it('Should have a main title', () => {
          cy.get('h1').contains('Verification Complete').should('be.visible')
        })

        it('Should show approving notice', () => {
          const message =
            'An Admin is now approving your account. You will be sent an email once your account has been approved.'

          cy.contains(message).should('be.visible')
        })

        it('Should have a link back to sign-in page', () => {
          cy.get('a').contains('Back to login').should('be.visible')
        })
      })
    })
  })
})
