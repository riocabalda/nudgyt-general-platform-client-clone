import useGetOrganization from '@/app/(shared)/hooks/useGetOrganization'
import useGetUser from '@/app/(shared)/hooks/useGetUser'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { redirect, useParams, useSearchParams } from 'next/navigation'
import { z } from 'zod'

const PageParamsSchema = z.object({
  orgId: z.string(),
  userId: z.string()
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
  const swrGetUser = useGetUser(query.organization, params.userId)
  const { redirectToOrganizationsPage } = useRedirectToOrganizationsPage()

  const viewedOrgSlug = query.organization
  const isOrgIdValid = orgInfo?._id === params.orgId

  const userInfo = swrGetUser.data ?? undefined
  const membership = userInfo?.organizations?.find(
    (membership) => membership.organization._id === params.orgId
  )
  const isUserOrgMember = membership !== undefined

  const isOrgInfoInvalid = orgInfo !== undefined && !isOrgIdValid
  const isUserInfoInvalid = userInfo !== undefined && !isUserOrgMember

  if (isOrgInfoInvalid || isUserInfoInvalid) {
    return redirectToOrganizationsPage()
  }

  return {
    ...{ params, query },
    viewedOrgSlug
  }
}

export default usePageParams
