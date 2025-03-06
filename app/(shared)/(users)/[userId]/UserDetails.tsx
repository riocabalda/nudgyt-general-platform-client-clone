'use client'

import { Card } from '@/app/(shared)/components/ui/card'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { User } from '@/app/(shared)/services/userService'
import { formatDateTime } from '@/app/(shared)/utils'

interface UserDetailsProps {
  user?: User
  completedServices?: number
  status?: React.ReactNode
}

function UserDetails({ user, completedServices, status }: UserDetailsProps) {
  const { orgSlug } = useOrganization()

  const orgMembership = user?.organizations?.find(
    (membership) => membership.organization.slug === orgSlug
  )

  const approveDate = orgMembership?.approved_at ?? null

  return (
    <Card className='rounded-none px-[16px] p-4 lg:p-[24px] gap-5 flex flex-col justify-between'>
      <div className='space-y-[24px] lg:space-y-0'>
        <div className='space-y-[8px] block lg:flex lg:items-center lg:justify-between'>
          <span className='uppercase text-xs font-medium text-neutral-gray-800 lg:text-sm tracking-widest'>
            Email address
          </span>
          <p className='text-sm font-normal text-neutral-gray-600 lg:text-sm'>
            {user?.email}
          </p>
        </div>
        <div className='space-y-[8px] block lg:flex lg:items-center lg:justify-between'>
          <span className='uppercase text-xs font-medium text-neutral-gray-800 lg:text-sm tracking-widest'>
            Date Joined
          </span>
          <p className='text-sm font-normal text-neutral-gray-600 lg:text-sm'>
            {approveDate && formatDateTime(approveDate)}
          </p>
        </div>
        <div className='space-y-[8px] block lg:flex lg:items-center lg:justify-between'>
          <span className='uppercase text-xs font-medium text-neutral-gray-800 lg:text-sm tracking-widest'>
            Completed Services
          </span>
          <p className='text-sm font-normal text-neutral-gray-600 lg:text-sm'>
            {completedServices}
          </p>
        </div>
      </div>

      {status && (
        <div className='block lg:flex items-center justify-between space-y-3 lg:space-y-0 pt-[19px] border-t-[1px] border-neutral-300'>
          <p className='text-xs font-medium text-neutral-gray-800 leading-tight uppercase tracking-wide'>
            Status
          </p>
          {status}
        </div>
      )}
    </Card>
  )
}

export default UserDetails
