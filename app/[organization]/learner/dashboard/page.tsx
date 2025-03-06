'use client'
import React from 'react'
import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import MainContainer from '@/app/(shared)/components/MainContainer'
import { roles } from '@/app/(shared)/services/userService'
import LearnerXPContainer from './components/LearnerXPContainer'
import ServicesList from './components/ServicesList'

function DashboardPage() {
  return (
    <RequireAuth role={[roles.learner]}>
      <MainContainer
        headerMobile={<MainContainer.HeaderMobile title='Dashboard' />}
        headerDesktop={<MainContainer.HeaderDesktop title='Dashboard' />}
      >
        <div className='container px-4 lg:px-[40px] pt-4 lg:pt-0'>
          <LearnerXPContainer />
          <ServicesList />
        </div>
      </MainContainer>
    </RequireAuth>
  )
}

export default DashboardPage
