'use client'

import AccessCardTemplate from '@/app/(shared)/(accounts)/AccessCardTemplate'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import userService from '@/app/(shared)/services/trainer/userService'
import { capitalize } from 'lodash'
import useSWR from 'swr'

function useGetAccess(organizationSlug: string) {
  const accessFetch = useSWR(
    ['/trainer/users/accounts/access', organizationSlug],
    ([, orgSlug]) => userService.getAccess(orgSlug).then((res) => res.data.data)
  )

  return accessFetch
}

function PublicAccessCard(props: { featuresHtml: string[] }) {
  const { featuresHtml } = props

  const { membership } = useOrganization()

  const firstOrgRole = membership?.roles[0]

  if (firstOrgRole === undefined) {
    return null
  }

  const roleTitle = capitalize(firstOrgRole)

  return (
    <AccessCardTemplate.Account
      title={`You have ${roleTitle} Access`}
      featuresHtml={featuresHtml}
    />
  )
}

function AccessCard() {
  const { orgSlug } = useOrganization()
  const accessFetch = useGetAccess(orgSlug)

  const access = accessFetch.data?.access
  const featuresHtml = accessFetch.data?.features_html ?? []

  if (access === 'public') {
    return <PublicAccessCard featuresHtml={featuresHtml} />
  }

  return null
}

export default AccessCard
