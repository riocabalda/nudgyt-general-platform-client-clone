// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on('uncaught:exception', (err) => {
  /**
   * Ignore errors from Eagle 3D
   *
   * https://docs.cypress.io/api/cypress-api/catalog-of-events#Uncaught-Exceptions
   */
  const isFromEagle3D = err.message.includes('elInfo')
  if (isFromEagle3D) {
    return false
  }

  /**
   * Inconsistent error that appears to depend on system load
   *
   * Might be related to Radix UI
   * - https://github.com/search?q=org%3Aradix-ui+undelivered+notifications&type=code
   * - https://github.com/radix-ui/primitives/issues/2313
   */
  const isResizeObserverUndeliveredNotifications = err.message.includes(
    'ResizeObserver loop completed with undelivered notifications'
  )
  if (isResizeObserverUndeliveredNotifications) {
    return false
  }

  return true
})
