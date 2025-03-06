import { HttpStatusCode } from 'axios'
import { apiUrl } from '../../utils/api'

function fillUpForm(
  options?: {
    withName?: boolean
    withEmail?: boolean
    withPassword?: boolean
    withPasswordConfirmation?: boolean
    withTermsAndConditions?: boolean
  },
  SampleInfo = {
    FullName: 'Example User',
    Email: 'valid@email.com',
    Password: 'Valid1-Password'
  }
) {
  const {
    withName = true,
    withEmail = true,
    withPassword = true,
    withPasswordConfirmation = true,
    withTermsAndConditions = true
  } = options ?? {}

  if (withName) {
    cy.get('input#fullName').type(SampleInfo.FullName)
  }
  if (withEmail) {
    cy.get('input#email').type(SampleInfo.Email)
  }
  if (withPassword) {
    cy.get('input#password').type(SampleInfo.Password)
  }
  if (withPasswordConfirmation) {
    cy.get('input#confirmPassword').type(SampleInfo.Password)
  }
  if (withTermsAndConditions) {
    cy.get('button#isTermsAndConditionsAccepted').click()
  }
}

const DEVICES = ['Desktop', 'Mobile'] as const
const PAGE_PATH = '/sign-up'

const LOGO_FILENAME = 'nudgyt-logo.png'

/** Only specific special characters are allowed */
const ASCII_PRINTABLE_SPECIAL = ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
const VALID_SPECIAL = '@$!%*?&-'
const INVALID_SPECIAL = Array.from(ASCII_PRINTABLE_SPECIAL)
  .filter((char) => !VALID_SPECIAL.includes(char))
  .join('')

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
      it('Can be accessed from sign-in page', () => {
        cy.visit('/sign-in')

        cy.get('a').contains('Sign up').click()

        cy.url().should('include', PAGE_PATH)
        cy.get('button').contains('Sign up').should('be.visible')
      })

      it('Can go back to sign-in page', () => {
        cy.get('a').contains('Log in').click()

        cy.url().should('include', '/sign-in')
        cy.get('button').contains('Log in').should('be.visible')
      })
    })

    describe('Main elements', () => {
      it('Should show Nudgyt logo', () => {
        cy.get('img')
          .should('be.visible')
          .and('have.attr', 'src')
          .and('include', LOGO_FILENAME)
      })

      /** Other role tabs are temporarily hidden */
      it.skip('Should have role selector tabs', () => {
        cy.get('[role=tablist]').should('be.visible')

        cy.get('button[role=tab]')
          .filter(':visible')
          .contains('Learner')
          .should('be.visible')
        cy.get('button[role=tab]')
          .filter(':visible')
          .contains('Trainer')
          .should('be.visible')
      })

      it('Should have full name input', () => {
        cy.get('input#fullName[name=fullName][placeholder="John Doe"]').should(
          'be.visible'
        )
      })

      it('Should have email address input', () => {
        cy.get(
          'input#email[type=email][name=email][placeholder="example@email.com"]'
        ).should('be.visible')
      })

      it('Should have main password input', () => {
        cy.get('input#password[type=password][name=password]').should(
          'be.visible'
        )
      })

      it('Should have password confirmation input', () => {
        cy.get(
          'input#confirmPassword[type=password][name=confirmPassword]'
        ).should('be.visible')
      })

      it('Should have terms and conditions checkbox', () => {
        cy.get('button#isTermsAndConditionsAccepted[role=checkbox]').should(
          'be.visible'
        )
      })

      it('Should have sign up button', () => {
        cy.get('button').contains('Sign up').should('be.visible')
      })

      it('Should have a link back to sign-in page', () => {
        cy.get('a[href="/sign-in"]').contains('Log in').should('be.visible')
      })
    })

    /** Skipped in favor of similar testing in sign-in flow */
    describe.skip('Email validity', () => {})

    describe('Password validity', () => {
      const message =
        'Minimum of 8 characters with at least one uppercase, one lowercase, one number, and one special character.'

      it('Should fail without an uppercase character', () => {
        const password = SAMPLE_PASSWORD.withoutUppercase

        cy.contains(message).should('not.exist') // Should not be visible yet

        cy.get('button#isTermsAndConditionsAccepted[role=checkbox]').click()
        cy.get('input#password[type=password]').type(password)
        cy.get('input#confirmPassword[type=password]').type(password)
        cy.get('button').contains('Sign up').click()

        cy.contains(message).should('be.visible')
      })

      it('Should fail without a lowercase character', () => {
        const password = SAMPLE_PASSWORD.withoutLowercase

        cy.contains(message).should('not.exist') // Should not be visible yet

        cy.get('button#isTermsAndConditionsAccepted[role=checkbox]').click()
        cy.get('input#password[type=password]').type(password)
        cy.get('input#confirmPassword[type=password]').type(password)
        cy.get('button').contains('Sign up').click()

        cy.contains(message).should('be.visible')
      })

      it('Should fail without a number character', () => {
        const password = SAMPLE_PASSWORD.withoutNumber

        cy.contains(message).should('not.exist') // Should not be visible yet

        cy.get('button#isTermsAndConditionsAccepted[role=checkbox]').click()
        cy.get('input#password[type=password]').type(password)
        cy.get('input#confirmPassword[type=password]').type(password)
        cy.get('button').contains('Sign up').click()

        cy.contains(message).should('be.visible')
      })

      it('Should fail without a valid special character', () => {
        const password = SAMPLE_PASSWORD.withoutSpecial

        cy.contains(message).should('not.exist') // Should not be visible yet

        cy.get('button#isTermsAndConditionsAccepted[role=checkbox]').click()
        cy.get('input#password[type=password]').type(password)
        cy.get('input#confirmPassword[type=password]').type(password)
        cy.get('button').contains('Sign up').click()

        cy.contains(message).should('be.visible')
      })

      /** Skipped because it is time-consuming */
      it.skip('Should fail with an invalid special character', () => {
        for (const invalidSpecialChar of INVALID_SPECIAL) {
          const password = SAMPLE_PASSWORD.withoutSpecial + invalidSpecialChar

          cy.contains(message).should('not.exist') // Should not be visible yet

          cy.get('button#isTermsAndConditionsAccepted[role=checkbox]').click()
          cy.get('input#password[type=password]').type(password)
          cy.get('input#confirmPassword[type=password]').type(password)
          cy.get('button').contains('Sign up').click()

          cy.contains(message).should('be.visible')

          cy.reload()
        }
      })

      it('Should succeed with a valid password', () => {
        const password = SAMPLE_PASSWORD.valid

        cy.get('button#isTermsAndConditionsAccepted[role=checkbox]').click()
        cy.get('input#password[type=password]').type(password)
        cy.get('input#confirmPassword[type=password]').type(password)
        cy.get('button').contains('Sign up').click()

        cy.contains(message).should('not.exist')
      })
    })

    describe('Password matching', () => {
      const messages = {
        main: 'Please enter your password.',
        confirm: 'Please confirm your password.'
      }

      it('Should fail with no password inputs', () => {
        for (const message of Object.values(messages)) {
          cy.contains(message).should('not.exist') // Should not be visible yet
        }

        cy.get('button#isTermsAndConditionsAccepted[role=checkbox]').click()
        cy.get('button').contains('Sign up').click()

        for (const message of Object.values(messages)) {
          cy.contains(message).should('be.visible')
        }
      })

      it('Should fail with only main password input', () => {
        const password = SAMPLE_PASSWORD.valid

        cy.contains(messages.confirm).should('not.exist') // Should not be visible yet

        cy.get('button#isTermsAndConditionsAccepted[role=checkbox]').click()
        cy.get('input#password[type=password]').type(password)
        cy.get('button').contains('Sign up').click()

        cy.contains(messages.confirm).should('be.visible')
        cy.contains(messages.main).should('not.exist')
      })

      it('Should fail with only password confirmation input', () => {
        const password = SAMPLE_PASSWORD.valid

        cy.contains(messages.main).should('not.exist') // Should not be visible yet

        cy.get('button#isTermsAndConditionsAccepted[role=checkbox]').click()
        cy.get('input#confirmPassword[type=password]').type(password)
        cy.get('button').contains('Sign up').click()

        cy.contains(messages.main).should('be.visible')
        cy.contains(messages.confirm).should('not.exist')
      })

      it('Should fail with mismatching passwords', () => {
        const message = 'Password does not match.'
        const password = SAMPLE_PASSWORD.valid
        const passwordMismatch = SAMPLE_PASSWORD.valid + '_'

        cy.contains(message).should('not.exist')

        cy.get('button#isTermsAndConditionsAccepted[role=checkbox]').click()
        cy.get('input#password[type=password]').type(password)
        cy.get('input#confirmPassword[type=password]').type(passwordMismatch)
        cy.get('button').contains('Sign up').click()

        cy.contains(message).should('be.visible')
      })

      it('Should succeed with matching password inputs', () => {
        const password = SAMPLE_PASSWORD.valid

        for (const message of Object.values(messages)) {
          cy.contains(message).should('not.exist')
        }

        cy.get('button#isTermsAndConditionsAccepted[role=checkbox]').click()
        cy.get('input#password[type=password]').type(password)
        cy.get('input#confirmPassword[type=password]').type(password)
        cy.get('button').contains('Sign up').click()

        for (const message of Object.values(messages)) {
          cy.contains(message).should('not.exist') // Should not exist at all
        }
      })
    })

    /** Signing up for other roles are temporarily hidden */
    describe.skip('Signing up', () => {
      it('Should fail with no full name', () => {
        const message = 'Please enter your full name.'

        cy.contains(message).should('not.exist')

        fillUpForm({ withName: false })
        cy.get('button').contains('Sign up').click()

        cy.contains(message).should('be.visible')
      })

      it('Should fail with no email', () => {
        const message = 'Please enter your email address.'

        cy.contains(message).should('not.exist')

        fillUpForm({ withEmail: false })
        cy.get('button').contains('Sign up').click()

        cy.contains(message).should('be.visible')
      })

      it('Should fail with no password', () => {
        const message = 'Please enter your password.'

        cy.contains(message).should('not.exist')

        fillUpForm({ withPassword: false })
        cy.get('button').contains('Sign up').click()

        cy.contains(message).should('be.visible')
      })

      it('Should fail with no password confirmation', () => {
        const message = 'Please confirm your password.'

        cy.contains(message).should('not.exist')

        fillUpForm({ withPasswordConfirmation: false })
        cy.get('button').contains('Sign up').click()

        cy.contains(message).should('be.visible')
      })

      it('Should fail with an existing email', () => {
        const message = 'This email has already been taken.'

        cy.contains(message).should('not.exist')

        cy.intercept('POST', apiUrl('/auth/register'), {
          statusCode: HttpStatusCode.UnprocessableEntity,
          fixture: 'auth/register/email-already-taken.json'
        }).as('register')

        fillUpForm()
        cy.get('button').contains('Sign up').click()

        cy.wait('@register')

        cy.contains(message).should('be.visible')
      })

      it('Should succeed when no issues', () => {
        cy.intercept('POST', apiUrl('/auth/register'), {
          fixture: 'auth/register/success.json'
        }).as('register')

        fillUpForm()
        cy.get('button').contains('Sign up').click()

        cy.wait('@register')

        cy.url().should('include', '/sign-up/success')
        cy.contains('You have successfully signed up!').should('be.visible')
      })
    })

    describe('Learner sign-up with organization code', () => {
      beforeEach(() => {
        cy.get('button[role=tab]')
          .filter(':visible')
          .contains('Learner')
          .click()
      })

      it('Has a Learner tab', () => {
        cy.get('button[role=tab]')
          .filter(':visible')
          .contains('Learner')
          .should('be.visible')
      })

      it('Has an organization code field', () => {
        cy.get('input#organizationCode[name=organizationCode]').should(
          'be.visible'
        )
      })
    })

    describe('Organizations', () => {
      describe('Main elements', () => {
        it('Should have an Organization role tab', () => {
          cy.get('button[role=tab]')
            .filter(':visible')
            .contains('Organization')
            .should('be.visible')
        })

        it.skip('Should not have organization name field for learners', () => {
          cy.get('button[role=tab]')
            .filter(':visible')
            .contains('Learner')
            .click()

          cy.get('input#organizationName[name=organizationName]').should(
            'not.exist'
          )
        })

        it.skip('Should not have organization name field for trainers', () => {
          cy.get('button[role=tab]')
            .filter(':visible')
            .contains('Trainer')
            .click()

          cy.get('input#organizationName[name=organizationName]').should(
            'not.exist'
          )
        })

        it('Should have organization name field for organizations', () => {
          cy.get('button[role=tab]')
            .filter(':visible')
            .contains('Organization')
            .click()

          cy.get('input#organizationName[name=organizationName]').should(
            'be.visible'
          )
        })
      })

      describe('Signing up', () => {
        it('Should fail with no organization name', () => {
          const message = 'Please enter your organization name.'

          cy.contains(message).should('not.exist')

          cy.get('button[role=tab]')
            .filter(':visible')
            .contains('Organization')
            .click()
          fillUpForm()
          cy.get('button').contains('Sign up').click()

          cy.contains(message).should('be.visible')
        })

        it('Should fail with existing organization', () => {
          const message = 'Organization name already exists'

          cy.contains(message).should('not.exist')

          cy.intercept('POST', apiUrl('/auth/register'), {
            statusCode: HttpStatusCode.Conflict,
            fixture: 'auth/register/organization-already-exists.json'
          }).as('register')

          fillUpForm()
          cy.get('input#organizationName').type('Existing Organization')
          cy.get('button').contains('Sign up').click()

          cy.wait('@register')

          cy.contains(message).should('be.visible')
        })

        it('Should succeed when no issues', () => {
          cy.intercept('POST', apiUrl('/auth/register'), {
            fixture: 'auth/register/success.json'
          }).as('register')

          cy.get('button[role=tab]')
            .filter(':visible')
            .contains('Organization')
            .click()
          fillUpForm()
          cy.get('input#organizationName').type('New Organization')
          cy.get('button').contains('Sign up').click()

          cy.wait('@register')

          cy.url().should('include', '/sign-up/success')
          cy.contains('You have successfully signed up!').should('be.visible')
        })
      })
    })

    describe('Invitations', () => {
      const loadPageDefaults = {
        /** Generic JWT from https://en.wikipedia.org/wiki/JSON_Web_Token */
        invitation_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dnZWRJbkFzIjoiYWRtaW4iLCJpYXQiOjE0MjI3Nzk2Mzh9.gzSraSYS8EXBxLN _oWnFSRgCzcmJmMjLiuyu5CSpyHI='
      }

      function loadPage(params: {
        email: string
        role: 'Admin' | 'Trainer' | 'Learner'
        invitation_token?: string
        organization?: string
      }) {
        const { email, role, organization } = params
        const {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          invitation_token = loadPageDefaults.invitation_token
        } = params

        const paramsObj = new URLSearchParams({ email, role, invitation_token })
        if (organization !== undefined) {
          paramsObj.set('organization', organization)
        }

        cy.visit(`/sign-up?${paramsObj}`)
      }

      describe('Invitations as public users', () => {
        const TEST_DATA = [
          {
            description: 'Invitation as admin',
            role: 'Admin',
            email: 'invited@admin.com'
          },
          {
            description: 'Invitation as trainer',
            role: 'Trainer',
            email: 'invited@trainer.com'
          },
          {
            description: 'Invitation as learner',
            role: 'Learner',
            email: 'invited@learner.com'
          }
        ] as const

        TEST_DATA.forEach(({ description, role, email }) => {
          describe(description, () => {
            beforeEach(() => {
              loadPage({ role, email })
              cy.get('button').contains('Sign up').should('be.visible') // Wait for page to load completely
            })

            it('Should not have role tabs', () => {
              cy.get('[role=tablist]').should('not.exist')
            })

            it('Should have a fixed email input', () => {
              cy.get('input#email[disabled]')
                .should('be.visible')
                .should('have.value', email)
            })

            it('Should send same info in URL query', () => {
              fillUpForm({
                withEmail: false
              })
              cy.get('button').contains('Sign up').click()

              cy.intercept('POST', apiUrl('/auth/register')).as('register')

              /** https://docs.cypress.io/app/guides/network-requests#Assertions */
              cy.get('@register').its('request.body.role').should('equal', role)
              cy.get('@register')
                .its('request.body.email')
                .should('equal', email)
              cy.get('@register')
                .its('request.body.invitation_token')
                .should('equal', loadPageDefaults.invitation_token)
            })
          })
        })
      })

      describe('Invitations as organization members', () => {
        const TEST_DATA = [
          {
            description: 'Invitation as admin',
            role: 'Admin',
            email: 'invited@admin.com',
            organization: 'Sample Organization'
          },
          {
            description: 'Invitation as trainer',
            role: 'Trainer',
            email: 'invited@trainer.com',
            organization: 'Sample Organization'
          },
          {
            description: 'Invitation as learner',
            role: 'Learner',
            email: 'invited@learner.com',
            organization: 'Sample Organization'
          }
        ] as const

        TEST_DATA.forEach(({ description, role, email, organization }) => {
          describe(description, () => {
            beforeEach(() => {
              loadPage({ role, email, organization })
              cy.get('button').contains('Sign up').should('be.visible') // Wait for page to load completely
            })

            it('Should not have role tabs', () => {
              cy.get('[role=tablist]').should('not.exist')
            })

            it('Should have a fixed email input', () => {
              cy.get('input#email[disabled]')
                .should('be.visible')
                .should('have.value', email)
            })

            it('Should have a fixed organization name input', () => {
              cy.get('input#organizationName[disabled]')
                .should('be.visible')
                .should('have.value', organization)
            })

            it('Should send same info in URL query', () => {
              fillUpForm({
                withEmail: false
              })
              cy.get('button').contains('Sign up').click()

              cy.intercept('POST', apiUrl('/auth/register')).as('register')

              /** https://docs.cypress.io/app/guides/network-requests#Assertions */
              cy.get('@register').its('request.body.role').should('equal', role)
              cy.get('@register')
                .its('request.body.email')
                .should('equal', email)
              cy.get('@register')
                .its('request.body.organization_name')
                .should('equal', organization)
              cy.get('@register')
                .its('request.body.invitation_token')
                .should('equal', loadPageDefaults.invitation_token)
            })
          })
        })
      })
    })
  })
})
