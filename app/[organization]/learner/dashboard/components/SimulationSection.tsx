import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function SimulationSection() {
  const { orgSlug } = useOrganization()
  return (
    <Card className='flex flex-col justify-between gap-6 px-4 py-8 lg:py-10 bg-white col-span-1 lg:space-y-0 lg:p-6 lg:h-full min-h-[190px]'>
      <h1 className='text-xl font-semibold lg:text-2xl'>Start a Simulation</h1>
      <div className='w-full flex flex-col space-y-[16px] lg:flex-row-reverse'>
        <Link href={`/${orgSlug}/learner/services`}>
          <Button
            type='button'
            className='w-full flex items-center justify-center gap-4 max-h-12 bg-purple-shade-darkest2 hover:bg-purple-shade-darkest2/90'
          >
            Choose Service
            <ArrowRight className='w-5 h-5' />
          </Button>
        </Link>
      </div>
    </Card>
  )
}

export default SimulationSection
