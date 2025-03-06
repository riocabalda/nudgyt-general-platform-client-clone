import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import MainContainer from '@/app/(shared)/components/MainContainer'
import { roles } from '@/app/(shared)/services/userService'
import ActivityLogs from './components/ActivityLogs'

function ActivityLogsPage() {
  return (
    <RequireAuth role={[roles.superadmin, roles.admin]}>
      <MainContainer
        headerMobile={<MainContainer.HeaderMobile title='Activity Logs' />}
        headerDesktop={<MainContainer.HeaderDesktop title='Activity Logs' />}
      >
        <div className='hidden lg:block container px-0 lg:px-[40px]'>
          <ActivityLogs />
        </div>
      </MainContainer>
    </RequireAuth>
  )
}

export default ActivityLogsPage
