'use client'

import useGetOrganization from '@/app/(shared)/hooks/useGetOrganization'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { redirect, useParams, useSearchParams } from 'next/navigation'
import { z } from 'zod'

const PageParamsSchema = z.object({
  orgId: z.string()
})

const PageQuerySchema = z.object({
  organization: z.string()
})

function useRedirectToOrganizationsPage() {
  const { orgSlug } = useOrganization()

  function redirectToOrganizationsPage() {
    return redirect(`/${orgSlug}/admin/organizations`)
  }

  return { redirectToOrganizationsPage }
}

function useParamsParsing() {
  const paramsRaw = useParams()
  const queryRaw = useSearchParams()
  const { redirectToOrganizationsPage } = useRedirectToOrganizationsPage()

  const { data: params } = PageParamsSchema.safeParse(paramsRaw)
  const { data: query } = PageQuerySchema.safeParse(
    Object.fromEntries(queryRaw)
  )

  const hasRequiredParams = params !== undefined && query !== undefined
  if (!hasRequiredParams) {
    return redirectToOrganizationsPage()
  }

  return { params, query }
}

function usePageParams() {
  const { params, query } = useParamsParsing()
  const { data: orgInfo } = useGetOrganization(query.organization)
  const { redirectToOrganizationsPage } = useRedirectToOrganizationsPage()

  const viewedOrgSlug = query.organization
  const isOrgIdValid = orgInfo?._id === params.orgId

  if (orgInfo !== undefined && !isOrgIdValid) {
    return redirectToOrganizationsPage()
  }

  return {
    ...{ params, query },
    viewedOrgSlug
  }
}

export default usePageParams
