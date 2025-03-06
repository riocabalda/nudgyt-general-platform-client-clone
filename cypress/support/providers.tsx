import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

const createRouter = (options: Partial<AppRouterInstance> = {}): AppRouterInstance => ({
  back: cy.stub().as('back'),
  forward: cy.stub().as('forward'),
  push: cy.stub().as('push'),
  replace: cy.stub().as('replace'),
  refresh: cy.stub().as('refresh'),
  prefetch: cy.stub().as('prefetch'),
  ...options,
})

export const AppRouterProvider = ({ children }: { children: React.ReactNode }) => {
  const router = createRouter()
  return (
    <AppRouterContext.Provider value={router}>
      {children}
    </AppRouterContext.Provider>
  )
}