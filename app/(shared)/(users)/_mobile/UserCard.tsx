import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Card } from '../../components/ui/card'
import { Checkbox } from '../../components/ui/checkbox'
import useOrganization from '../../hooks/useOrganization'
import { useUserStore } from '../../hooks/useUsersStore'
import { PaginatedUser } from '../../services/admin/userService'
import {
  invitationStatus,
  OrganizationMembership
} from '../../services/userService'
import { cn, getUserOrgRole, pluralize } from '../../utils'
import { UserIndicatorColor } from '../indicator-color'

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

function UserCard({ user }: { user: PaginatedUser }) {
  const { orgSlug } = useOrganization()
  const { selectedUsers, toggleUser, showMultipleCheckbox } = useUserStore()
  const router = useRouter()

  const orgMembership = user?.organizations?.find(
    (membership) => membership.organization.slug === orgSlug
  )

  const status = getStatus(user, orgMembership)
  const bgColor = UserIndicatorColor[status]

  const selectedUser = selectedUsers.some((r) => r._id === user._id)

  const serviceCt = user.services ?? 0

  const handleGetUserDetails = (userId: string) => {
    router.push(`/${orgSlug}/admin/users/${userId}`)
  }

  return (
    <Card
      className={cn('block p-4 rounded-[8px] cursor-pointer', {
        'border-2 border-brandcolora': showMultipleCheckbox && selectedUser
      })}
      onClick={() =>
        showMultipleCheckbox ? toggleUser(user) : handleGetUserDetails(user._id)
      }
    >
      <div className='block text-foreground'>
        <div className='flex items-start justify-between'>
          <div className='flex items-start gap-3'>
            {showMultipleCheckbox && (
              <Checkbox
                className='mt-1'
                checked={selectedUser}
                onCheckedChange={() => toggleUser(user)}
              />
            )}
            <div className='flex flex-col justify-start'>
              <h2 className='font-semibold '>{user.full_name}</h2>
              <p className='text-muted-foreground'>
                {getUserOrgRole(user, orgSlug)}
              </p>
            </div>
          </div>
          {!showMultipleCheckbox && (
            <span>
              <ChevronRight size={24} strokeWidth={1.5} />
            </span>
          )}
        </div>
      </div>
      <div className='flex items-center justify-between mt-4'>
        <p className='text-sm text-brandcolora'>
          {serviceCt > 0 ? (
            <>
              {serviceCt} {pluralize({ word: 'service', count: serviceCt })}
            </>
          ) : (
            <>N/A</>
          )}
        </p>
        <div className='flex items-center gap-2'>
          <span
            className='block w-[10px] h-[10px] rounded-full bg-brandcolora'
            style={{ backgroundColor: bgColor }}
          />
          <p className='text-sm'>{status}</p>
        </div>
      </div>
    </Card>
  )
}

export default UserCard
