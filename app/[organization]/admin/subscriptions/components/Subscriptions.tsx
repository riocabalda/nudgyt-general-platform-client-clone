'use client'

import React from 'react'
import SubscriptionCard from './SubscriptionCard'

const subscriptionsMock = [
  {
    id: '1',
    name: 'Free Tier',
    features:
      '<ul><li>Access to Course Documents of completed Trainings</li></ul>',
    price: '0',
    time: '0'
  },
  {
    id: '2',
    name: 'Basic Tier',
    features:
      '<ul><li>Access to Course Documents of completed Trainings</li></ul>',
    price: '$12',
    time: '60 m'
  },
  {
    id: '3',
    name: 'Professional Tier',
    features:
      '<ul><li>Access to Course Documents of completed Trainings</li></ul>',
    price: '$36',
    time: '3 h'
  },
  {
    id: '4',
    name: 'Unlimited Tier',
    features:
      '<ul><li>Access to Course Documents of completed Trainings</li></ul>',
    price: '$60',
    time: 'Unlimited'
  }
]

function SubscriptionsList() {
  // const { data, error, isLoading } = useSWR<{ data: Subscription[] }>(
  //   '/admin/subscriptions',
  //   () => subscriptionService.getSubscriptions().then((res) => res.data)
  // )
  // if (error)
  //   return <FetchError errorMessage={error?.response?.data?.message} />

  // if (isLoading) return <Loader className='w-4 h-4 mr-2 animate-spin' />

  return (
    <ul className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-rows-4 lg:grid-rows-2 gap-6 lg:gap-[40px] p-4 lg:p-0'>
      {/* {data?.data.length ? (
        data.data.map((subscription) => (
          <SubscriptionCard key={subscription.id} subscription={subscription} />
        ))
      ) : (
        <p className='font-semibold text-gray-400'>No subscriptions yet</p>
      )} */}
      {subscriptionsMock.map((subscription) => (
        <SubscriptionCard key={subscription.name} subscription={subscription} />
      ))}
    </ul>
  )
}

export default SubscriptionsList
