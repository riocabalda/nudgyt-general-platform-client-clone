import React from 'react'
import { roles } from '@/app/(shared)/services/userService'
import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import ServicesContainer from './components/ServicesContainer'

function ServicesPage() {
  return (
    <RequireAuth role={[roles.learner]}>
      <ServicesContainer />
    </RequireAuth>
  )
}

export default ServicesPage
