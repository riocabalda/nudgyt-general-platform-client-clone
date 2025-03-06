import AddUserModal from '@/app/(shared)/(users)/AddUserModal'
import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import MainContainer from '@/app/(shared)/components/MainContainer'
import { roles } from '@/app/(shared)/services/userService'
import DynamicUsers from './components/DynamicUsers'

function UsersPage() {
  return (
    <RequireAuth role={[roles.superadmin, roles.admin]}>
      <MainContainer
        headerMobile={<MainContainer.HeaderMobile title='Users' />}
        headerDesktop={
          <MainContainer.HeaderDesktop
            title='Users'
            slotEnd={<AddUserModal />}
          />
        }
        className='!px-0'
      >
        <DynamicUsers />
      </MainContainer>
    </RequireAuth>
  )
}

export default UsersPage
