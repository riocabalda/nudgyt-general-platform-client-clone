import { OrganizationStatus } from '../services/admin/organizationService'
import { cn } from '../utils'

export function UserStatusIndicator(props: { status: string }) {
  const { status } = props

  return (
    <div
      className={cn(
        'size-[10px] rounded-full',
        status === 'Pending' && 'bg-status-unverified',
        status === 'Declined' && 'bg-status-archived',
        status === 'Approved' && 'bg-status-approved',
        status === 'Verified' && 'bg-status-verified',
        status === 'Unverified' && 'bg-status-unverified',
        status === 'Archived' && 'bg-status-archived',
        status === 'Blocked' && 'bg-status-blocked'
      )}
    ></div>
  )
}

export function OrganizationStatusIndicator(props: {
  status: OrganizationStatus
}) {
  const { status } = props

  return (
    <div
      className={cn(
        'size-[10px] rounded-full',
        status === OrganizationStatus.Active && 'bg-status-approved',
        status === OrganizationStatus.Inactive && 'bg-status-unverified',
        status === OrganizationStatus.Suspended && 'bg-status-blocked'
      )}
    ></div>
  )
}
