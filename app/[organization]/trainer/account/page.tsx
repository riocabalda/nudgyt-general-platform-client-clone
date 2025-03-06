import MainContainer from '@/app/(shared)/components/MainContainer'
import AccountContent from './components/AccountContent'

async function AccountPage() {
  return (
    <MainContainer
      headerMobile={<MainContainer.HeaderMobile title='Account' />}
      headerDesktop={<MainContainer.HeaderDesktop title='Account' />}
    >
      <AccountContent />
    </MainContainer>
  )
}

export default AccountPage
