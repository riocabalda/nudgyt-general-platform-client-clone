import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import { roles } from '@/app/(shared)/services/userService'
import { ReactNode } from 'react'

function GeneralSettingsLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth role={[roles.superadmin, roles.admin]} shouldBeOrgOwner>
      {children}
    </RequireAuth>
  )
}

export default GeneralSettingsLayout
