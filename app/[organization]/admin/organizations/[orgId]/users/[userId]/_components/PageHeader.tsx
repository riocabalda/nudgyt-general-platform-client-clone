'use client'

import MainContainer from '@/app/(shared)/components/MainContainer'
import useGetUser from '@/app/(shared)/hooks/useGetUser'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import usePageParams from '../_hooks/usePageParams'

function useUserFullName() {
  const { params } = usePageParams()
  const { orgSlug } = useOrganization()

  const { data: user } = useGetUser(orgSlug, params.userId)

  const fullName = user?.full_name ?? 'User'

  return fullName
}

export function DesktopHeader() {
  const fullName = useUserFullName()

  return <MainContainer.HeaderDesktop title={fullName} showBackBtn />
}

export function MobileHeader() {
  const fullName = useUserFullName()

  return <MainContainer.HeaderMobile title={fullName} />
}
