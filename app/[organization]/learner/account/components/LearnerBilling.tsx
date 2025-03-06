'use client'

import organizationConfig from '@/app/(shared)/config/organizationConfig'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { cn } from '@/app/(shared)/utils'
import AccessCard from './AccessCard'
import BilledToCard from './BilledToCard'
import BillingPeriodCard from './BillingPeriodCard'
import InvoicesSection from './InvoicesSection'
import PaymentMethodCard from './PaymentMethodCard'

function SubscriptionSection(props: { className?: string }) {
  const { className } = props

  return (
    <section className={cn(className)}>
      <AccessCard />

      <BillingPeriodCard />
      <PaymentMethodCard />
      <BilledToCard />
    </section>
  )
}

function LearnerBilling() {
  const { membership } = useOrganization()

  const orgName = membership?.organization.name
  const isPublicMember = orgName === organizationConfig.PUBLIC_ORGANIZATION_NAME

  if (!isPublicMember) {
    return null
  }

  return (
    <>
      <SubscriptionSection className='space-y-6' />
      <InvoicesSection />
    </>
  )
}

export default LearnerBilling
