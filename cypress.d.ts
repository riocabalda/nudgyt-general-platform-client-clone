/** https://stackoverflow.com/a/78743793 */
declare namespace Cypress {
  interface Chainable {
    login(role: string): Chainable<void>

    /**
     * Give role as path of desired user in
     * `/cypress/fixtures/auth/me/success/`
     */
    assumeLogin(role: string): Chainable<void>
  }
}
