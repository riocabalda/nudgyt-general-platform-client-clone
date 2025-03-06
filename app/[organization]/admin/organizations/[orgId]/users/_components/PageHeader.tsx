'use client'

import AddUserModal from '@/app/(shared)/(users)/AddUserModal'
import MainContainer from '@/app/(shared)/components/MainContainer'
import useOrganizationName from '../_hooks/useOrganizationName'

function useHeaderTitle() {
  const orgName = useOrganizationName()

  if (orgName !== undefined) {
    return `${orgName}'s Users`
  }

  return 'Organization Users'
}

export function DesktopHeader() {
  const orgName = useOrganizationName()
  const title = useHeaderTitle()

  return (
    <MainContainer.HeaderDesktop
      showBackBtn
      title={title}
      slotEnd={<AddUserModal forceOrgName={orgName} />}
    />
  )
}

export function MobileHeader() {
  const title = useHeaderTitle()

  return <MainContainer.HeaderMobile showBackBtn title={title} />
}
