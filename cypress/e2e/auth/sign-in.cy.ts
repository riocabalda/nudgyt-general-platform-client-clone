import { HttpStatusCode } from 'axios'
import { apiUrl } from '../../utils/api'

/**
 * Sign-in is successful if redirected to Dashboard
 *
 * `.should()` here comes before `.contains()` because:
 * - there are multiple `h1`
 * - `.should()` checks all of them and passes if at least one is visible
 * - `.contains()` only gets the first one
 */
function checkDashboard() {
  cy.url().should('include', '/dashboard')
  cy.get('h1').should('be.visible').contains('Dashboard')
}

/** Sidebar contains proper role badge */
function checkRoleBadge(role: string) {
  const roleRegex = new RegExp(role)
  cy.get('aside').contains(roleRegex).should('be.visible')
}

const DEVICES = ['Desktop', 'Mobile'] as const
const PAGE_PATH = '/'

const LOGO_FILENAME = 'nudgyt-logo.png'
const EMAIL_PLACEHOLDER = 'example@email.com'
const PASSWORD_PLACEHOLDER = 'Enter password'

const SAMPLE_PASSWORD = "you can't see me"

const CORRECT_EMAIL = 'approved.learner@user.com'
const CORRECT_PASSWORD = 'Approved1-Learner'
const INCORRECT_EMAIL = 'incorrect@email.com'
const INCORRECT_PASSWORD = 'incorrectPassword.'
const INVALID_EMAIL = 'invalid@email'

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

    describe('Visible elements', () => {
      it('Should show Nudgyt logo', () => {
        cy.get('img')
          .should('be.visible')
          .and('have.attr', 'src')
          .and('include', LOGO_FILENAME)
      })

      it('Should show email field', () => {
        cy.get('input#email')
          .should('have.attr', 'type', 'email')
          .should('have.attr', 'placeholder', EMAIL_PLACEHOLDER)
      })

      it('Should show password field', () => {
        cy.get('input#password')
          .should('have.attr', 'type', 'password')
          .should('have.attr', 'placeholder', PASSWORD_PLACEHOLDER)
      })

      it('Should show log in button', () => {
        cy.get('button').should('contain.text', 'Log in')
      })
    })

    describe('Password visibility', () => {
      it('Should hide password when typing', () => {
        cy.get('input#password')
          .type(SAMPLE_PASSWORD)
          .should('have.attr', 'type', 'password')
          .and('have.value', SAMPLE_PASSWORD)
      })

      it('Should show password after toggling', () => {
        cy.get('input#password').type(SAMPLE_PASSWORD)

        /** Toggle password visibility */
        cy.get('input#password + button').click()

        /** Password is shown when input type is changed to regular text */
        cy.get('input#password')
          .should('have.attr', 'type', 'text')
          .and('have.value', SAMPLE_PASSWORD)
      })

      it('Should hide password again after toggling', () => {
        cy.get('input#password').type(SAMPLE_PASSWORD)

        cy.get('input#password + button').click() // Show

        cy.get('input#password')
          .should('have.attr', 'type', 'text') // Visible
          .and('have.value', SAMPLE_PASSWORD)

        cy.get('input#password + button').click() // Hide

        cy.get('input#password')
          .should('have.attr', 'type', 'password') // Hidden
          .and('have.value', SAMPLE_PASSWORD)
      })
    })

    describe('Unsuccessful sign in', () => {
      it('Should fail with email only', () => {
        const errorMessage = 'Please enter your password.'

        cy.contains(errorMessage).should('not.exist') // Error should not be visible yet

        cy.get('#email').type(CORRECT_EMAIL)
        cy.get('button').contains('Log in').click()

        cy.contains(errorMessage).should('be.visible')
      })
      it('Should fail with password only', () => {
        const errorMessage = 'Please enter your email address.'

        cy.contains(errorMessage).should('not.exist') // Error should not be visible yet

        cy.get('#password').type(CORRECT_PASSWORD)
        cy.get('button').contains('Log in').click()

        cy.contains(errorMessage).should('be.visible')
      })

      it('Should fail with unregistered email', () => {
        const errorMessage = 'Invalid email or password.'

        cy.intercept('POST', apiUrl('/auth/login'), {
          statusCode: HttpStatusCode.Forbidden,
          fixture: 'auth/login/invalid-email-password.json'
        }).as('login')

        cy.contains(errorMessage).should('not.exist') // Error should not be visible yet

        cy.get('#email').type(INCORRECT_EMAIL)
        cy.get('#password').type(CORRECT_PASSWORD)
        cy.get('button').contains('Log in').click()

        cy.wait('@login')

        cy.contains(errorMessage).should('be.visible')
      })
      it('Should fail with incorrect password', () => {
        const errorMessage = 'Invalid email or password.'

        cy.intercept('POST', apiUrl('/auth/login'), {
          statusCode: HttpStatusCode.Forbidden,
          fixture: 'auth/login/invalid-email-password.json'
        }).as('login')

        cy.contains(errorMessage).should('not.exist') // Error should not be visible yet

        cy.get('#email').type(CORRECT_EMAIL)
        cy.get('#password').type(INCORRECT_PASSWORD)
        cy.get('button').contains('Log in').click()

        cy.wait('@login')

        cy.contains(errorMessage).should('be.visible')
      })

      it('Should fail with invalid email', () => {
        const errorMessage = 'Invalid email address'

        cy.contains(errorMessage).should('not.exist') // Error should not be visible yet

        cy.get('#email').type(INVALID_EMAIL)
        cy.get('#password').type(CORRECT_PASSWORD)
        cy.get('button').contains('Log in').click()

        cy.contains(errorMessage).should('be.visible')
      })

      it('Should fail with no credentials', () => {
        const errorMessages = [
          'Please enter your email address.',
          'Please enter your password.'
        ]

        for (const errorMessage of errorMessages) {
          cy.contains(errorMessage).should('not.exist') // Error should not be visible yet
        }

        cy.get('button').contains('Log in').click()

        for (const errorMessage of errorMessages) {
          cy.contains(errorMessage).should('be.visible')
        }
      })
    })

    describe('Successful sign in', () => {
      const TEST_DATA = [
        { fixturePath: 'system/super-admin', role: 'Super Admin' },
        { fixturePath: 'admin', role: 'Admin' },
        { fixturePath: 'trainer', role: 'Trainer' },
        { fixturePath: 'learner', role: 'Learner' }
      ] as const

      TEST_DATA.forEach(({ fixturePath, role }) => {
        it(`Should succeed with ${role} credentials`, () => {
          cy.login(fixturePath)

          checkDashboard()
          if (device === 'Desktop') {
            checkRoleBadge(role)
          }
        })
      })

      it('Should succeed with Owner credentials', () => {
        cy.login('organization/owner')

        checkDashboard()
        if (device === 'Desktop') {
          checkRoleBadge('Admin')
        }
      })
    })
  })
})
