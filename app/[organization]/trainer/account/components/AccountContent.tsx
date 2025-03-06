import InvitationCardList from '@/app/(shared)/(invitations)/InvitationCardList'
import AccessCard from './AccessCard'
import Profile from './Profile'

function AccountContent() {
  return (
    <div className='lg:max-w-[600px] mx-auto space-y-6'>
      <Profile />
      <InvitationCardList className='space-y-6' />
      <AccessCard />
    </div>
  )
}

export default AccountContent
