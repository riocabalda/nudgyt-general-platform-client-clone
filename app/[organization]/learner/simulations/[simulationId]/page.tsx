import React from 'react'
import { roles } from '@/app/(shared)/services/userService'
import RequireAuth from '@/app/(shared)/components/helper/RequireAuth'
import SimulationContainer from './components/SimulationContainer'

function SimulationPage() {
  return (
    <RequireAuth role={[roles.learner]}>
      <SimulationContainer />
    </RequireAuth>
  )
}

export default SimulationPage
