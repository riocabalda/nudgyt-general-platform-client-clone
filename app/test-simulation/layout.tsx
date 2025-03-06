import React, { Suspense } from 'react'

function LayoutPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>{children}</div>
    </Suspense>
  )
}

export default LayoutPage
