'use client'

import React, { useEffect } from 'react'
import { Medal } from 'lucide-react'
import { cn } from '@/app/(shared)/utils'
import { Role } from '../types/simulationFormTypes'
import { Card } from '@/app/(shared)/components/ui/card'
import { Button } from '@/app/(shared)/components/ui/button'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import useOrganization from '@/app/(shared)/hooks/useOrganization'

function SimulationComplete({ role }: { role: Role }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { simulationId } = useParams()
  const { orgSlug } = useOrganization()

  const isTrialData = role === Role.ADMIN || role === Role.TRAINER

  const isTrialQueryString = isTrialData ? `?is_trial_results=true` : ''

  useEffect(() => {
    if (searchParams.has('panel')) {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.delete('panel')
      router.replace(`?${newSearchParams.toString()}`)
    }
  }, [searchParams, router])

  return (
    <section className='px-4 lg:px-0 mt-6 lg:mt-[88px] max-w-[712px] mx-auto'>
      <Card className='flex flex-col items-center px-4 pt-10 pb-6 lg:p-10'>
        <Medal className='text-brandcolora' size={80} strokeWidth={1} />
        <h1
          className={cn(
            'text-[32px] font-medium text-foreground mt-6',
            isTrialData && 'mb-[60px]'
          )}
        >
          Well done!
        </h1>
        {!isTrialData && (
          <p className='text-sm text-muted-foreground mt-10'>
            Your responses have been submitted.
          </p>
        )}
        <Link
          href={`/${orgSlug}/${role}/simulations/${simulationId}/results${isTrialQueryString}`}
          className='hidden lg:block w-full lg:w-fit mt-10'
          replace
        >
          <Button variant='default' className='w-full'>
            View Results
          </Button>
        </Link>
        <Link
          href={`/${orgSlug}/${role}/mobile/simulations/${simulationId}/results${isTrialQueryString}`}
          className='lg:hidden w-full lg:w-fit mt-10'
          replace
        >
          <Button variant='default' className='w-full'>
            View Results
          </Button>
        </Link>
      </Card>
    </section>
  )
}

export default SimulationComplete
