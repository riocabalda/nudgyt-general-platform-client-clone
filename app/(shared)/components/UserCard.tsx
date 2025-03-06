'use client'

import useOrganization from '../hooks/useOrganization'
import useUser from '../hooks/useUser'
import { roles } from '../services/userService'
import { cn, generateAvatarInitials } from '../utils'
import { Avatar, AvatarFallback } from './ui/avatar'
import UserRoleBadge from './UserRoleBadge'

function UserCard() {
  const { membership } = useOrganization()
  const { user } = useUser()

  const firstOrgRole = membership?.roles[0]

  return (
    <div className='flex items-center gap-4 bg-transparent'>
      <Avatar className='size-[46px] lg:size-[50px]'>
        <AvatarFallback
          className={cn(
            'text-white',
            firstOrgRole === roles.learner ? 'bg-[#F3706F]' : 'bg-primary-500'
          )}
        >
          {generateAvatarInitials(user?.full_name || 'N')}
        </AvatarFallback>
      </Avatar>

      <div className='flex flex-col gap-1 grow'>
        <p className='font-medium truncate text-sm lg:text-base w-[150px]'>
          {user?.full_name}
        </p>

        {firstOrgRole !== undefined && <UserRoleBadge role={firstOrgRole} />}
      </div>
    </div>
  )
}

export default UserCard
