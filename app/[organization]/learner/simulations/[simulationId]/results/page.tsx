'use client'
import MainContainer from '@/app/(shared)/components/MainContainer'
import ResultContainer from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/components/ResultContainer'
import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import { roles } from '@/app/(shared)/services/userService'
import RetrySimulationButton from '@/app/(shared)/components/admin-trainer-learner-shared/simulations/components/RetrySimulationButton'

function SimulationResultsPage() {
  return (
    <RequireAuth role={[roles.learner]}>
      <MainContainer
        headerMobile={<MainContainer.HeaderMobile title='Service Results' />}
        headerDesktop={
          <MainContainer.HeaderDesktop
            title='Service Results'
            showBackBtn
            slotEnd={<RetrySimulationButton />}
          />
        }
        className='lg:container pb-20 lg:p-0'
      >
        <ResultContainer />
        <div className='fixed bottom-0 w-full p-4 pb-[40px] bg-white flex flex-col lg:hidden'>
          <RetrySimulationButton />
        </div>
      </MainContainer>
    </RequireAuth>
  )
}

export default SimulationResultsPage
