'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import authTokenService from '@/app/(shared)/services/authTokenService'
import { cn } from '@/app/(shared)/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function OrganizationPlanPage() {
  const { orgSlug } = useOrganization()
  const router = useRouter()
  const [cardIdx, setCardIdx] = useState(0)

  function signOut() {
    authTokenService.removeTokens()
    router.replace('/sign-in')
  }

  function previousCard() {
    if (cardIdx === 0) {
      signOut()

      return
    }

    setCardIdx((idx) => idx - 1)
  }

  function nextCard() {
    if (cardIdx === 2) {
      router.replace(`/${orgSlug}/admin/dashboard`)

      return
    }

    setCardIdx((idx) => idx + 1)
  }

  return (
    <main className='min-h-screen grid place-items-center'>
      <Card className='space-y-12 px-20 py-10 max-w-[600px]'>
        <Image
          src='/images/nudgyt-logo.png'
          alt='Nudgyt logo'
          height={65}
          width={228}
          quality={100}
          className='object-contain mx-auto'
        />

        <div className='space-y-6'>
          <h1 className='font-semibold text-2xl'>
            {cardIdx === 0 && (
              <>You&rsquo;re about to set up your Organization on Nudgyt.</>
            )}
            {cardIdx === 1 && <>Finalize Your Subscription</>}
            {cardIdx === 2 && <>Your Subscription is Active!</>}
          </h1>

          <p className='text-neutral-gray-600'>
            {cardIdx !== 2 && (
              <>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Adipisci officia animi reprehenderit asperiores temporibus
                architecto? Deserunt, quidem illum est quod omnis explicabo
                minima provident magnam, nulla laudantium quae. Sint, vitae?
              </>
            )}
            {cardIdx === 2 && (
              <>
                Congratulations! Your organization&rsquo;s subscription has been
                successfully activated. You now have full access to all the
                powerful features of Nudgyt, including unlimited simulations,
                advanced tools, and premium support.
                <br />
                <br />
                Your team is ready to start training, learning, and growing with
                our AI-powered simulations.
              </>
            )}
          </p>
        </div>

        <footer
          className={cn(
            'grid gap-6',
            cardIdx !== 2 && 'grid-cols-2',
            cardIdx === 2 && 'place-items-center'
          )}
        >
          {cardIdx !== 2 && (
            <Button variant='outline' onClick={previousCard}>
              Back
            </Button>
          )}

          <Button
            onClick={nextCard}
            className={cn(
              'bg-primary-500 hover:bg-primary-500/90',
              cardIdx === 2 && 'w-1/2'
            )}
          >
            {cardIdx === 0 && <>Confirm Subscription</>}
            {cardIdx === 1 && <>Proceed to Payment</>}
            {cardIdx === 2 && <>Get Started</>}
          </Button>
        </footer>

        <p className='text-center text-neutral-gray-600'>
          Something not right?{' '}
          <Link
            href='mailto:info@nudgyt.com'
            className='text-primary-500 underline underline-offset-2'
          >
            Contact Nudgyt
          </Link>
        </p>
      </Card>
    </main>
  )
}

export default OrganizationPlanPage
