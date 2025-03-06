'use client'

import useSWR from 'swr'
import useOrganization from '../hooks/useOrganization'
import userService from '../services/admin/userService'
import { formatPrice } from '../utils'
import AccessCardTemplate from './AccessCardTemplate'

function useGetAccess(organizationSlug: string) {
  const accessFetch = useSWR(
    ['/admin/users/accounts/access', organizationSlug],
    ([, orgSlug]) => userService.getAccess(orgSlug).then((res) => res.data.data)
  )

  return accessFetch
}

function OrganizationAccessCard(props: {
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
      title='You have Organization Access'
      featuresHtml={featuresHtml}
      body={
        <p className='text-neutral-gray-800'>
          <span className='font-medium text-2xl'>{priceFormatted}</span> monthly
        </p>
      }
      // footer={
      //   <footer className='grid'>
      //     <Button variant='outline' className='gap-5 cursor-not-allowed'>
      //       <span>Go to Billing</span>
      //       <ArrowRight className='size-5' />
      //     </Button>
      //   </footer>
      // }
    />
  )
}

function AccessCardAdmin() {
  const { orgSlug } = useOrganization()
  const accessFetch = useGetAccess(orgSlug)

  const access = accessFetch.data?.access
  const featuresHtml = accessFetch.data?.features_html ?? []
  const price = accessFetch.data?.price

  if (access === 'organization') {
    return <OrganizationAccessCard featuresHtml={featuresHtml} price={price} />
  }

  return null
}

export default AccessCardAdmin
