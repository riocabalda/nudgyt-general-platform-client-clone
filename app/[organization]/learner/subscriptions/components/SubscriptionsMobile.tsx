'use client'

import { Button } from '@/app/(shared)/components/ui/button'
import { cn } from '@/app/(shared)/utils'
import { useState } from 'react'
import SubscriptionCard from './SubscriptionCard'
import { MockSubscription, subscriptionsMock } from './Subscriptions'

function SubscriptionsMobile() {
  const [selectedSubscription, setSelectedSubscription] =
    useState<MockSubscription | null>(null)
  const currentSubscription = subscriptionsMock.find(
    (sub) => sub.selected === true
  )
  const subscriptions = subscriptionsMock.filter(
    (sub) => sub.id !== currentSubscription?.id
  )

  const handleSelectedSubscription = (subscription: MockSubscription) => {
    setSelectedSubscription(subscription)
  }

  const hasRate =
    selectedSubscription?.price !== null && selectedSubscription?.time !== null

  return (
    <div className='flex flex-col lg:hidden'>
      <section className='px-4 py-6 bg-white border-b h-fit border-input'>
        <header className='font-semibold text-foreground-800'>
          Current Subscription
        </header>

        {currentSubscription !== undefined && (
          <SubscriptionCard
            subscription={currentSubscription}
            className='p-4 min-h-fit'
          />
        )}
      </section>

      <section className='px-4 py-10 pb-[200px]'>
        <p className='text-foreground-800'>Select a tier to subscribe to</p>

        <div className='grid grid-cols-1 grid-rows-3 gap-4 mt-5'>
          {subscriptions.map((subscription) => (
            <button
              key={subscription.name}
              className={cn(
                'rounded-[8px] text-left',
                subscription.id === selectedSubscription?.id &&
                  'ring-2 ring-brandcolora'
              )}
              onClick={() => handleSelectedSubscription(subscription)}
            >
              <SubscriptionCard subscription={subscription} />
            </button>
          ))}
        </div>
      </section>

      <footer
        className={`fixed bottom-0 w-full p-4 bg-white ${
          !selectedSubscription && 'invisible'
        }`}
      >
        <h2 className='text-lg font-semibold text-foreground'>
          {selectedSubscription?.name}
        </h2>

        {!hasRate ? (
          <p className='mt-2 font-medium text-brandcolora'>Free</p>
        ) : (
          <p className='mt-2 font-medium text-brandcolora'>
            {selectedSubscription?.price} / {selectedSubscription?.time}
          </p>
        )}

        <Button className='w-full mt-6'>Select</Button>
      </footer>
    </div>
  )
}

export default SubscriptionsMobile
