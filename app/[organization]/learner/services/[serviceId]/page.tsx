import React from 'react'
import { roles } from '@/app/(shared)/services/userService'
import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import MainContainer from '@/app/(shared)/components/MainContainer'
import StartSimulationButton from './components/StartSimulationButton'
import ServiceDetails from './components/ServiceDetails'

function ServiceDetailsPage() {
  return (
    <RequireAuth role={[roles.learner]}>
      <MainContainer
        headerMobile={
          <MainContainer.HeaderMobile title='Service Details' showBackBtn />
        }
        headerDesktop={
          <MainContainer.HeaderDesktop
            title='Service Details'
            slotEnd={<StartSimulationButton />}
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
