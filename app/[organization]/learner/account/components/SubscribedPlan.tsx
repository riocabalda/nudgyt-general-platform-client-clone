'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import Link from 'next/link'

function ChangePlanLink() {
  const { orgSlug } = useOrganization()

  return (
    <Button asChild variant='outline'>
      <Link href={`/${orgSlug}/learner/subscriptions`}>Change plan</Link>
    </Button>
  )
}

function SubscribedPlan() {
  return (
    <Card className='rounded-none lg:rounded-[8px] px-4 py-10 lg:px-20 space-y-6'>
      <h3 className='text-center text-neutral-gray-800 font-semibold text-xl'>
        You are on the Free Tier
      </h3>

      <ul className='list-disc ml-5'>
        <li className='text-neutral-gray-600 text-sm'>
          Access to Course Documents of{' '}
          <span className='font-bold'>completed</span> Trainings
        </li>
      </ul>

      <footer className='grid'>
        <ChangePlanLink />
      </footer>
    </Card>
  )
}

export default SubscribedPlan
