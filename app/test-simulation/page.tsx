'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'

function TestSimulationPage() {
  const simulationLinkParam = useSearchParams().get('simulation_link')

  return (
    <iframe
      allow='camera'
      id='iframe_1'
      src={String(simulationLinkParam)}
      width='100%'
      height='600px'
      allowFullScreen
    />
  )
}

export default TestSimulationPage
