import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import MainContainer from '@/app/(shared)/components/MainContainer'
import { roles } from '@/app/(shared)/services/userService'
import ChangePlan from './components/ChangePlan'
import BillingPeriod from './components/BillingPeriod'
import PaymentMethod from './components/PaymentMethod'
import Owner from './components/Owner'
import Invoices from './components/Invoices'

function BillingPage() {
  return (
    <RequireAuth role={[roles.superadmin, roles.admin]}>
      <MainContainer
        headerMobile={<MainContainer.HeaderMobile title='Billing' />}
        headerDesktop={<MainContainer.HeaderDesktop title='Billing' />}
      >
        <div className='flex flex-col gap-6 items-center'>
          <ChangePlan />
          <BillingPeriod />
          <PaymentMethod />
          <Owner />
          <Invoices />
        </div>
      </MainContainer>
    </RequireAuth>
  )
}

export default BillingPage
