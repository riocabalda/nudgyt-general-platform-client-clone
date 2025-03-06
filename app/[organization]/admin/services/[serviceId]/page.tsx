import React from 'react'
import { roles } from '@/app/(shared)/services/userService'
import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import MainContainer from '@/app/(shared)/components/MainContainer'
import HeaderActions from './components/HeaderAction'
import ServiceDetails from './components/ServiceDetails'

function ServiceDetailsPage() {
  return (
    <RequireAuth role={[roles.superadmin, roles.admin]}>
      <MainContainer
        headerMobile={
          <MainContainer.HeaderMobile title='Service Details' showBackBtn />
        }
        headerDesktop={
          <MainContainer.HeaderDesktop
            title='Service Details'
            slotEnd={<HeaderActions />}
            showBackBtn
          />
        }
      >
        <ServiceDetails />
      </MainContainer>
    </RequireAuth>
  )
}

export default ServiceDetailsPage
