import React from 'react'
import SubscribedPlan from './SubscribedPlan'

function SubscriptionPlan() {
  return (
    <div className='flex flex-col mt-10 '>
      <h1 className='text-xl font-medium lg:text-[32px] text-brandcolorc'>
        Subscription Plan
      </h1>
      <div className='flex flex-wrap gap-4 pt-[30px]'>
        <SubscribedPlan />
      </div>
    </div>
  )
}

export default SubscriptionPlan
