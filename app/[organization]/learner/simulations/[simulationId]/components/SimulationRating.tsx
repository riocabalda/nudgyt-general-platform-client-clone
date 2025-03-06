'use client'

import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import FeedbackForm from './FeedbackForm'

function SimulationRating() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.has('panel')) {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.delete('panel')
      router.replace(`?${newSearchParams.toString()}`)
    }
  }, [searchParams, router])

  return (
    <section className='px-4 lg:px-0 max-w-[600px] mx-auto'>
      <FeedbackForm />
    </section>
  )
}

export default SimulationRating
