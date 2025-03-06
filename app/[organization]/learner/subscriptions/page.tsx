import React from 'react'
import Subscriptions from './components/Subscriptions'
import MainContainer from '@/app/(shared)/components/MainContainer'
import SubscriptionsMobile from './components/SubscriptionsMobile'

async function SubscriptionsPage() {
  return (
    <MainContainer
      headerMobile={
        <MainContainer.HeaderMobile title='Update Subscription' showBackBtn />
      }
      headerDesktop={
        <MainContainer.HeaderDesktop title='Update Subscription' showBackBtn />
      }
    >
      <SubscriptionsMobile />
      <Subscriptions />
    </MainContainer>
  )
}

export default SubscriptionsPage
