import PersonalDetailsForm from '@/app/(shared)/(accounts)/edit-profile/PersonalDetailsForm'
import MainContainer from '@/app/(shared)/components/MainContainer'
import { Card } from '@/app/(shared)/components/ui/card'

async function PersonalDetailsPage() {
  return (
    <MainContainer
      headerMobile={
        <MainContainer.HeaderMobile title='Personal Details' showBackBtn />
      }
      headerDesktop={
        <MainContainer.HeaderDesktop title='Personal Details' showBackBtn />
      }
    >
      <div className='flex flex-col gap-4 lg:gap-[40px] items-center'>
        <Card className='rounded-none lg:rounded-[8px] shadow-sm px-4 py-[40px] lg:px-[24px] lg:max-w-[600px] w-full'>
          <PersonalDetailsForm />
        </Card>
      </div>
    </MainContainer>
  )
}

export default PersonalDetailsPage
