'use client'

import AccessCardTemplate from '@/app/(shared)/(accounts)/AccessCardTemplate'
import { Button } from '@/app/(shared)/components/ui/button'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import planService from '@/app/(shared)/services/learner/planService'
import { AnnotatedPlan } from '@/app/(shared)/types'
import { cn, formatPrice } from '@/app/(shared)/utils'
import useSWR from 'swr'
import UpgradePlanModal from './UpgradePlanModal'

function useGetLearnerPlans(organizationSlug: string) {
  const plansFetch = useSWR(
    ['/learner/plans', organizationSlug],
    ([, orgSlug]) => planService.getPlans(orgSlug).then((res) => res.data.data)
  )

  return plansFetch
}

function CurrentPlanButton() {
  return (
    <Button
      disabled
      variant='outline'
      className='bg-transparent disabled:bg-muted disabled:text-input'
    >
      Current plan
    </Button>
  )
}

function PublicTrialPlanCard(props: {
  plan: AnnotatedPlan
  withoutFooter?: boolean
}) {
  const { plan } = props
  const { withoutFooter } = props

  const featuresHtml = plan.features_html

  return (
    <AccessCardTemplate.Upgrade
      title={
        <>
          Public Access <span className='font-normal'>(Free Trial)</span>
        </>
      }
      featuresHtml={featuresHtml}
      body={<p className='text-neutral-gray-800 font-medium text-2xl'>Free</p>}
      footer={
        withoutFooter ? null : (
          <footer className='mt-auto grid'>
            {plan.is_current ? (
              <CurrentPlanButton />
            ) : (
              <UpgradePlanModal
                body={<PublicTrialPlanCard plan={plan} withoutFooter />}
              />
            )}
          </footer>
        )
      }
      className={cn(
        withoutFooter
          ? 'border border-neutral-gray-400'
          : 'h-full max-w-[333px]'
      )}
    />
  )
}

function PublicPaidPlanCard(props: {
  plan: AnnotatedPlan
  withoutFooter?: boolean
}) {
  const { plan } = props
  const { withoutFooter } = props

  const currencyCode = 'USD' // Use from API?

  const featuresHtml = plan.features_html
  const priceFormatted = formatPrice(plan.price, currencyCode)

  return (
    <AccessCardTemplate.Upgrade
      title='Public Access'
      featuresHtml={featuresHtml}
      body={
        <p className='text-neutral-gray-800'>
          <span className='font-medium text-2xl'>{priceFormatted}</span> monthly
        </p>
      }
      footer={
        withoutFooter ? null : (
          <footer className='mt-auto grid'>
            {plan.is_current ? (
              <CurrentPlanButton />
            ) : (
              <UpgradePlanModal
                body={<PublicPaidPlanCard plan={plan} withoutFooter />}
              />
            )}
          </footer>
        )
      }
      className={cn(
        withoutFooter
          ? 'border border-neutral-gray-400'
          : 'h-full max-w-[333px]'
      )}
    />
  )
}

function PlanSelectionCard(props: { plan: AnnotatedPlan }) {
  const { plan } = props

  if (plan.type === 'public-trial') {
    return <PublicTrialPlanCard plan={plan} />
  }

  if (plan.type === 'public') {
    return <PublicPaidPlanCard plan={plan} />
  }

  return null
}

function PlanSelection() {
  const { orgSlug } = useOrganization()
  const { data: plans } = useGetLearnerPlans(orgSlug)

  return (
    <ol className='p-4 lg:p-0 lg:container flex flex-wrap items-stretch gap-6 lg:gap-[40px]'>
      {plans?.map((plan) => (
        <li key={plan._id}>
          <PlanSelectionCard plan={plan} />
        </li>
      ))}
    </ol>
  )
}

export default PlanSelection
