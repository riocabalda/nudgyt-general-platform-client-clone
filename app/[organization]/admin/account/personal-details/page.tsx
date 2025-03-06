import PersonalDetailsModal from '@/app/(shared)/(accounts)/edit-profile/PersonalDetailsModal'
import MainContainer from '@/app/(shared)/components/MainContainer'
import AccountContent from '../components/AccountContent'

async function PersonalDetailsPage() {
  return (
    <>
      <MainContainer
        headerMobile={<MainContainer.HeaderMobile title='Personal Details' />}
        headerDesktop={<MainContainer.HeaderDesktop title='Account' />}
      >
        <AccountContent />
      </MainContainer>
      <PersonalDetailsModal />
    </>
  )
}

export default PersonalDetailsPage
