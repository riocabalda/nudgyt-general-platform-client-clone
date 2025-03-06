import { OrganizationIndicatorColor } from '@/app/(shared)/(users)/indicator-color'
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

  const bgColor = OrganizationIndicatorColor[organization.status]

  return (
    <div className='flex items-center gap-[10px]'>
      <span
        className='h-[10px] w-[10px] rounded-full block'
        style={{ backgroundColor: bgColor }}
      ></span>
      <OrganizationStatusMenu
        tier={tier}
        organization={organization}
        status={organization.status}
      />
    </div>
  )
}

export default OrganizationStatus
