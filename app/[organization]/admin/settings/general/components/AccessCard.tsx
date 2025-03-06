'use client'

import AccessCardAdmin from '@/app/(shared)/(accounts)/AccessCardAdmin'
import useOrganization from '@/app/(shared)/hooks/useOrganization'

function AccessCard() {
  const { membership } = useOrganization()

  const isOwner = membership?.is_owner ?? false

  /** Only owner access card should be shown here */
  if (isOwner) {
    return <AccessCardAdmin />
  }

  return null
}

export default AccessCard
