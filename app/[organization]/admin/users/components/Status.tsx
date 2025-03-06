import { UserIndicatorColor } from '@/app/(shared)/(users)/indicator-color'
import { PaginatedUser } from '@/app/(shared)/services/admin/userService'
import {
  invitationStatus,
  OrganizationMembership
} from '@/app/(shared)/services/userService'
import StatusMenu from './StatusMenu'

function getStatus(
  user: PaginatedUser,
  orgMembership?: OrganizationMembership
) {
  const status = orgMembership?.status

  const approveDate = orgMembership?.approved_at ?? null
  const blockDate = orgMembership?.blocked_at ?? null

  if (user.archived_at !== null) {
    return 'Archived'
  }
  if (blockDate !== null) {
    return 'Blocked'
  }

  if (status === invitationStatus.PENDING) {
    return 'Pending'
  }
  if (status === invitationStatus.DECLINED) {
    return 'Declined'
  }

  if (approveDate !== null && user.email_verified_at !== null) {
    return 'Approved'
  }
  if (user.email_verified_at !== null) {
    return 'Verified'
  }

  return 'Unverified'
}

function Status(props: {
  user: PaginatedUser
  orgMembership?: OrganizationMembership
  isForUserDetail?: boolean
}) {
  const { user, orgMembership } = props
  const { isForUserDetail } = props

  const status = getStatus(user, orgMembership)
  const bgColor = UserIndicatorColor[status]

  return (
    <div
      className={`flex items-center gap-[10px]  ${isForUserDetail && 'border-[1px] border-neutral-400 rounded-[4px] px-[10px] py-[13px] lg:border-none lg:p-0'}`}
    >
      <span
        className='h-[10px] w-[10px] rounded-full block'
        style={{ backgroundColor: bgColor }}
      ></span>
      <StatusMenu
        user={user}
        status={status}
        isForUserDetail={isForUserDetail}
      />
    </div>
  )
}

export default Status
