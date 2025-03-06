import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import MainContainer from '@/app/(shared)/components/MainContainer'
import { roles } from '@/app/(shared)/services/userService'
import PageContent from './_components/PageContent'
import { DesktopHeader, MobileHeader } from './_components/PageHeader'

export default function OrganizationUserPage() {
  return (
    <RequireAuth role={[roles.superadmin, roles.admin]}>
      <MainContainer
        headerDesktop={<DesktopHeader />}
        headerMobile={<MobileHeader />}
      >
        <PageContent />
      </MainContainer>
    </RequireAuth>
  )
}
