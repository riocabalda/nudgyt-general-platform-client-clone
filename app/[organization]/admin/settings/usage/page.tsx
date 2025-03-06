import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import MainContainer from '@/app/(shared)/components/MainContainer'
import { roles } from '@/app/(shared)/services/userService'
import MetricSection from './components/MetricSection'
import PopularSection from './components/PopularSection'
import StatsTab from './components/StatsTab'

function DashboardPage() {
  return (
    <RequireAuth role={[roles.superadmin, roles.admin]} shouldBeOrgOwner>
      <MainContainer
        headerMobile={<MainContainer.HeaderMobile title='Usage' />}
        headerDesktop={<MainContainer.HeaderDesktop title='Usage' />}
      >
        <div className='container p-4 lg:py-0 lg:px-[40px]'>
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-0 lg:gap-6 mb-6'>
            <MetricSection />
            <div className='block lg:hidden px-6'>
              <hr className='border-neutral-gray-400' />
            </div>
            <PopularSection />
          </div>
        </div>

        <StatsTab />
      </MainContainer>
    </RequireAuth>
  )
}

export default DashboardPage
