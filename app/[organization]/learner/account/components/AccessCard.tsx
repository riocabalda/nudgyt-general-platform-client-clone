'use client'

import AccessCardTemplate from '@/app/(shared)/(accounts)/AccessCardTemplate'
import { Button } from '@/app/(shared)/components/ui/button'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import userService from '@/app/(shared)/services/learner/userService'
import { formatPrice } from '@/app/(shared)/utils'
import Link from 'next/link'
import useSWR from 'swr'
import CancelRenewalModal from './CancelRenewalModal'

function useGetAccess(organizationSlug: string) {
  const accessFetch = useSWR(
    ['/learner/users/accounts/access', organizationSlug],
    ([, orgSlug]) => userService.getAccess(orgSlug).then((res) => res.data.data)
  )

  return accessFetch
}

function UpgradeAccessLink() {
  const { orgSlug } = useOrganization()

  return (
    <Button asChild variant='outline'>
      <Link href={`/${orgSlug}/learner/account/upgrade`}>Upgrade Access</Link>
    </Button>
  )
}

function PublicPaidAccessCard(props: {
  featuresHtml: string[]
  price?: number
}) {
  const { featuresHtml, price } = props

  const currencyCode = 'USD' // Use from API?

  if (price === undefined) {
    return null
  }

  const priceFormatted = formatPrice(price, currencyCode)

  return (
    <AccessCardTemplate.Account
      title='You have Public Access'
      featuresHtml={featuresHtml}
      body={
        <p className='text-neutral-gray-800'>
          <span className='font-medium text-2xl'>{priceFormatted}</span> monthly
        </p>
      }
      footer={
        <footer className='grid'>
          <CancelRenewalModal
            body={
              <AccessCardTemplate.Upgrade
                title='Public Access'
                featuresHtml={featuresHtml}
                body={
                  <p className='text-neutral-gray-800'>
                    <span className='font-medium text-2xl'>
                      {priceFormatted}
                    </span>{' '}
                    monthly
                  </p>
                }
                className='border border-neutral-gray-400'
              />
            }
          />
        </footer>
      }
    />
  )
}

function PublicTrialAccessCard(props: { featuresHtml: string[] }) {
  const { featuresHtml } = props

  return (
    <AccessCardTemplate.Account
      title={
        <>
          You have Public Access{' '}
          <span className='font-normal'>(Free Trial)</span>
        </>
      }
      featuresHtml={featuresHtml}
      footer={
        <footer className='grid'>
          <UpgradeAccessLink />
        </footer>
      }
    />
  )
}

function AccessCard() {
  const { orgSlug } = useOrganization()
  const accessFetch = useGetAccess(orgSlug)

  const access = accessFetch.data?.access
  const featuresHtml = accessFetch.data?.features_html ?? []
  const price = accessFetch.data?.price

  if (access === 'public-trial') {
    return <PublicTrialAccessCard featuresHtml={featuresHtml} />
  }
  if (access === 'public') {
    return <PublicPaidAccessCard featuresHtml={featuresHtml} price={price} />
  }

  return null
}

export default AccessCard
