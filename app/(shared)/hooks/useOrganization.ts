'use client'

import { useParams } from 'next/navigation'
import { z } from 'zod'
import useUser from './useUser'

const ParamsSchema = z.object({
  organization: z.string()
})

function useOrganization() {
  const rawParams = useParams()
  const { user } = useUser()

  const params = ParamsSchema.parse(rawParams)
  const orgSlug = params.organization

  const membership = user?.organizations?.find(
    (membership) => membership.organization.slug === orgSlug
  )

  return { orgSlug, membership }
}

export default useOrganization
