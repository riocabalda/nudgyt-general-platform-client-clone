'use client'

import SubscriptionCard from './SubscriptionCard'

export type MockSubscription = {
  id: string
  name: string
  features: string
  price: string | null
  time: string | null
  selected: boolean
}
export const subscriptionsMock: MockSubscription[] = [
  {
    id: crypto.randomUUID(),
    name: 'Free Tier',
    features: `
      <ul>
        <li>Access to Course Documents of <strong>completed</strong> Trainings</li>
      </ul>
    `,
    price: null,
    time: null,
    selected: true
  },
  {
    id: crypto.randomUUID(),
    name: 'Basic Tier',
    features: `
      <ul>
        <li>Access to Course Documents of <strong>completed</strong> Trainings</li>
        <li>Access to Simulations of <strong>completed</strong> Trainings</li>
        <li><strong>60 minutes</strong> of Simulation time</li>
      </ul>
    `,
    price: '$12',
    time: '60 mins',
    selected: false
  },
  {
    id: crypto.randomUUID(),
    name: 'Professional Tier',
    features: `
      <ul>
        <li>Access to Course Documents of <strong>completed</strong> Trainings</li>
        <li>Access to <strong>all</strong> Simulations</li>
        <li><strong>360 minutes (6 hours)</strong> of Simulation time</li>
      </ul>
    `,
    price: '$36',
    time: '360 mins',
    selected: false
  },
  {
    id: crypto.randomUUID(),
    name: 'Unlimited Tier',
    features: `
      <ul>
        <li>Access to Course Documents of <strong>completed</strong> Trainings</li>
        <li>Access to <strong>all</strong> Simulations</li>
        <li><strong>Unlimited</strong> Simulation time</li>
      </ul>
    `,
    price: '$60',
    time: 'Unlimited',
    selected: false
  }
]

function Subscriptions() {
  return (
    <ul className='container hidden lg:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-rows-4 lg:grid-rows-2 gap-6 lg:gap-[40px]'>
      {subscriptionsMock.map((subscription) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          withFooter
        />
      ))}
    </ul>
  )
}

export default Subscriptions
