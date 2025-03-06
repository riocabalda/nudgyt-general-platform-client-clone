/**
 * https://stackoverflow.com/a/78987231
 *
 * ---
 *
 * Component tests require lots of mocking
 *
 * Possibly useful links:
 * - https://stackoverflow.com/a/77623034
 * - https://www.cypress.io/blog/component-testing-next-js-with-cypress
 * - https://github.com/mike-plummer/nextjs-cypress-ct-example/tree/main/components/BackButton
 */
import BillingPage from '@/app/[organization]/admin/billing/page'
import {
  AppRouterContext,
  AppRouterInstance
} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import * as Router from 'next/navigation'

describe('<BillingPage />', () => {
  it('renders', () => {
    const router = {
      push: cy.stub().as('router:push')
    } as unknown as AppRouterInstance
    cy.stub(Router, 'useRouter').returns(router)

    cy.mount(
      <AppRouterContext.Provider value={router}>
        <BillingPage />
      </AppRouterContext.Provider>
    )
  })
})
