import MainContainer from '@/app/(shared)/components/MainContainer'
import PageContent from '../components/PageContent'
import OrganizationProfileModal from './components/OrganizationProfileModal'

function OrganizationDetailsPage() {
  return (
    <MainContainer
      headerMobile={<MainContainer.HeaderMobile title='General' />}
      headerDesktop={<MainContainer.HeaderDesktop title='General' />}
    >
      <PageContent />

      <OrganizationProfileModal />
    </MainContainer>
  )
}

export default OrganizationDetailsPage
