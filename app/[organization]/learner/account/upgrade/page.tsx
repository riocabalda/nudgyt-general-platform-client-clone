import MainContainer from '@/app/(shared)/components/MainContainer'
import PlanSelection from './components/PlanSelection'
// import PlanSelectionMobile from './components/PlanSelectionMobile'

async function UpgradeAccessPage() {
  return (
    <MainContainer
      headerMobile={
        <MainContainer.HeaderMobile title='Upgrade Access' showBackBtn />
      }
      headerDesktop={
        <MainContainer.HeaderDesktop title='Upgrade Access' showBackBtn />
      }
      className='container'
    >
      {/* <PlanSelectionMobile /> */}
      <PlanSelection />
    </MainContainer>
  )
}

export default UpgradeAccessPage
