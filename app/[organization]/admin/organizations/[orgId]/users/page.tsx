import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import RequirePublicAdmin from '@/app/(shared)/components/helper/RequirePublicAdmin'
import MainContainer from '@/app/(shared)/components/MainContainer'
import { roles } from '@/app/(shared)/services/userService'
import OrganizationContent from './_components/OrganizationContent'
import { DesktopHeader, MobileHeader } from './_components/PageHeader'

function OrganizationPage() {
  return (
    <RequireAuth role={[roles.superadmin, roles.admin]}>
      <RequirePublicAdmin>
        <MainContainer
          headerDesktop={<DesktopHeader />}
          headerMobile={<MobileHeader />}
          className='lg:container'
        >
          <OrganizationContent />
        </MainContainer>
      </RequirePublicAdmin>
    </RequireAuth>
  )
}

export default OrganizationPage
