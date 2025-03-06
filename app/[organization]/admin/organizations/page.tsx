import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import RequirePublicAdmin from '@/app/(shared)/components/helper/RequirePublicAdmin'
import MainContainer from '@/app/(shared)/components/MainContainer'
import { roles } from '@/app/(shared)/services/userService'
import AddOrganizationModal from './_components/AddOrganizationModal'
import OrganizationTabs from './_components/OrganizationTabs'

function OrganizationsPage() {
  return (
    <RequireAuth role={[roles.superadmin, roles.admin]}>
      <RequirePublicAdmin>
        <MainContainer
          headerDesktop={
            <MainContainer.HeaderDesktop
              title='Organizations'
              slotEnd={<AddOrganizationModal />}
            />
          }
          headerMobile={<MainContainer.HeaderMobile title='Organizations' />}
        >
          <OrganizationTabs />
        </MainContainer>
      </RequirePublicAdmin>
    </RequireAuth>
  )
}

export default OrganizationsPage
