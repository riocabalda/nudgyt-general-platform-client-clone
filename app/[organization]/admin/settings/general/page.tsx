import MainContainer from '@/app/(shared)/components/MainContainer'
import PageContent from './components/PageContent'

function GeneralSettingsPage() {
  return (
    <MainContainer
      headerMobile={<MainContainer.HeaderMobile title='General' />}
      headerDesktop={<MainContainer.HeaderDesktop title='General' />}
    >
      <PageContent />
    </MainContainer>
  )
}

export default GeneralSettingsPage
