import PasswordForm from '@/app/(shared)/(accounts)/change-password/PasswordForm'
import MainContainer from '@/app/(shared)/components/MainContainer'
import { Card } from '@/app/(shared)/components/ui/card'

async function ChangePasswordPage() {
  return (
    <MainContainer
      headerMobile={
        <MainContainer.HeaderMobile title='Change Password' showBackBtn />
      }
      headerDesktop={
        <MainContainer.HeaderDesktop title='Change Password' showBackBtn />
      }
    >
      <div className='flex flex-col gap-4 lg:gap-[40px] items-center'>
        <Card className='rounded-none lg:rounded-[8px] shadow-sm px-4 py-[40px] lg:px-[24px] lg:max-w-[600px] w-full'>
          <PasswordForm />
        </Card>
      </div>
    </MainContainer>
  )
}

export default ChangePasswordPage
