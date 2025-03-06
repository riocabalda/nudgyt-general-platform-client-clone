import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import MainContainer from '@/app/(shared)/components/MainContainer'
import { roles } from '@/app/(shared)/services/userService'
import MetricSection from './components/MetricSection'
import PopularServices from './components/PopularServices'
import UsageTabs from './components/UsageTabs'

function UsagePage() {
  return (
    <RequireAuth role={[roles.superadmin, roles.admin]}>
      <MainContainer
        headerMobile={<MainContainer.HeaderMobile title='Usage' />}
        headerDesktop={<MainContainer.HeaderDesktop title='Usage' />}
      >
        <div className='container px-0 lg:px-[40px] space-y-5 lg:space-y-10'>
          <div className='flex gap-6 flex-col xl:flex-row'>
            <MetricSection />
            <PopularServices />
          </div>
          <UsageTabs />
        </div>
      </MainContainer>
    </RequireAuth>
  )
}

export default UsagePage
