import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import MainContainer from '@/app/(shared)/components/MainContainer'
import { roles } from '@/app/(shared)/services/userService'
import Subscriptions from './components/Subscriptions'

async function SubscriptionsPage() {
  return (
    <RequireAuth role={[roles.superadmin, roles.admin]}>
      <MainContainer
        headerMobile={<MainContainer.HeaderMobile title='Subscriptions' />}
        headerDesktop={<MainContainer.HeaderDesktop title='Subscriptions' />}
      >
        <Subscriptions />
      </MainContainer>
    </RequireAuth>
  )
}

export default SubscriptionsPage
