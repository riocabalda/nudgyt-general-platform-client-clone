import Alert from '@/app/(shared)/components/alert/Alert'
import { ReactNode } from 'react'

function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Alert />
    </>
  )
}

export default AdminLayout
