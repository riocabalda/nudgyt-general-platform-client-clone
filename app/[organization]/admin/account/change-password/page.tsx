import PasswordModal from '@/app/(shared)/(accounts)/change-password/PasswordModal'
import MainContainer from '@/app/(shared)/components/MainContainer'
import AccountContent from '../components/AccountContent'

async function ChangePasswordPage() {
  return (
    <>
      <MainContainer
        headerMobile={<MainContainer.HeaderMobile title='Account' />}
        headerDesktop={<MainContainer.HeaderDesktop title='Account' />}
      >
        <AccountContent />
      </MainContainer>
      <PasswordModal />
    </>
  )
}

export default ChangePasswordPage
