import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import { roles } from '@/app/(shared)/services/userService'
import { ReactNode } from 'react'

function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth role={[roles.superadmin, roles.admin]}>{children}</RequireAuth>
  )
}

export default AccountLayout
