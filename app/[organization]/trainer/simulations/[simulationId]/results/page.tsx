import MainContainer from '@/app/(shared)/components/MainContainer'
import ResultContainer from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/components/ResultContainer'
import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import { roles } from '@/app/(shared)/services/userService'
import './style.css'

function SimulationResultsPage() {
  return (
    <RequireAuth role={[roles.trainer]}>
      <MainContainer
        headerMobile={<MainContainer.HeaderMobile title='Service Results' />}
        headerDesktop={
          <MainContainer.HeaderDesktop title='Service Results' showBackBtn />
        }
        className='pb-20 lg:p-0'
      >
        <ResultContainer />
      </MainContainer>
    </RequireAuth>
  )
}

export default SimulationResultsPage
