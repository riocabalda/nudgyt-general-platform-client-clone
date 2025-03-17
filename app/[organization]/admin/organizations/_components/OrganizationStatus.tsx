import { OrganizationStatusIndicator } from '@/app/(shared)/(users)/StatusIndicator'
import {
  EnterpriseUser,
  OrganizationUser
} from '@/app/(shared)/services/admin/organizationService'
import { TierEnum } from '@/app/(shared)/types'
import OrganizationStatusMenu from './OrganizationStatusMenu'

function OrganizationStatus(props: {
  tier: TierEnum
  organization: OrganizationUser | EnterpriseUser
}) {
  const { tier, organization } = props

  return (
    <div className='flex items-center gap-[10px]'>
      <OrganizationStatusIndicator status={organization.status} />
      <OrganizationStatusMenu
        tier={tier}
        organization={organization}
        status={organization.status}
      />
    </div>
  )
}

export default OrganizationStatus
