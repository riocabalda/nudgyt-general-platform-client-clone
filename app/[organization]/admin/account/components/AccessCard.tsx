'use client'

import AccessCardAdmin from '@/app/(shared)/(accounts)/AccessCardAdmin'
import useOrganization from '@/app/(shared)/hooks/useOrganization'

function AccessCard() {
  const { membership } = useOrganization()

  const isOwner = membership?.is_owner ?? false

  /** Owner access card is shown in general settings */
  if (isOwner) {
    return null
  }

  return <AccessCardAdmin />
}

export default AccessCard
