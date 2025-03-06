import z from 'zod'
import { apiUrl } from '../utils/api'

/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

/**
 * For custom commands,
 * add the command name to `cypress.d.ts` for type checking
 */

/** https://docs.cypress.io/app/end-to-end-testing/testing-your-app#Reusing-the-login-code */
Cypress.Commands.add('login', (role) => {
  const signInFixturePath = `auth/login/success/${role}.json`

  cy.fixture(signInFixturePath).then((signInFixture) => {
    const email = z.string().parse(signInFixture?.data?.user?.email)

    /** Go to home page */
    cy.visit('/')

    /** Intercept login request */
    cy.intercept('POST', apiUrl('/auth/login'), (req) => {
      req.reply({
        fixture: signInFixturePath,
        headers: {
          'Set-Cookie': 'nudgyt-rtkn=;'
        }
      })
    }).as('login')

    /** Sign in with sample credentials */
    cy.get('#email').type(email)
    cy.get('#password').type('Valid1-Password')
    cy.get('button').contains('Log in').click()

    cy.wait('@login')

    /**
     * Only intercept request for self info after signing in
     * Otherwise it will automatically sign in!
     */
    cy.intercept('GET', apiUrl('/auth/me'), {
      fixture: `auth/me/success/${role}.json`
    })

    /** Refresh token cookie is given after login */
    cy.getCookie('nudgyt-rtkn').should('exist')
  })
})

Cypress.Commands.add('assumeLogin', (role) => {
  cy.intercept('GET', apiUrl('/auth/me'), {
    fixture: `auth/me/success/${role}.json`
  })
})
