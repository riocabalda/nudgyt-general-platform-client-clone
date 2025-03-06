'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PropsWithChildren } from 'react'
import organizationConfig from '../config/organizationConfig'
import useOrganization from '../hooks/useOrganization'
import useUser from '../hooks/useUser'
import {
  invitationStatus,
  OrganizationMembership,
  roles
} from '../services/userService'
import { cn, generateAvatarInitials, getRoleSlug, replaceSlugs } from '../utils'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from './ui/dropdown-menu'

function getSubtitleRoleText(membership: OrganizationMembership) {
  const firstOrgRole = membership.roles[0]

  if (membership.is_owner) {
    return `${firstOrgRole} (Owner)`
  }

  return firstOrgRole
}

function AccountSwitcherAvatar(props: {
  type?: 'regular' | 'compact'
  avatarSrc?: string
  fallbackBaseText?: string
  role?: string // Should this be kept?
}) {
  const { type = 'regular' } = props
  const { avatarSrc, fallbackBaseText = 'N' } = props
  const { role } = props

  return (
    <Avatar
      className={cn(
        type === 'regular' && 'size-10',
        type === 'compact' && 'size-6',
        'border border-white'
      )}
    >
      <AvatarImage src={avatarSrc} className='object-cover' />
      <AvatarFallback
        className={cn(
          'select-none',
          type === 'regular' && 'text-lg',
          type === 'compact' && 'text-[10px]',
          'text-white',
          role === roles.learner ? 'bg-[#F3706F]' : 'bg-primary-500'
        )}
      >
        {generateAvatarInitials(fallbackBaseText)}
      </AvatarFallback>
    </Avatar>
  )
}

function MembershipCard(props: {
  type?: 'regular' | 'compact'
  membership: OrganizationMembership
  title: string
  subtitle: string
  className?: string
}) {
  const { type = 'regular' } = props
  const { membership } = props
  const { title, subtitle } = props
  const { className } = props

  const firstOrgRole = membership.roles[0]

  const avatarSrc = membership.organization.logo

  return (
    <section
      className={cn('overflow-hidden', 'flex items-center gap-2', className)}
    >
      <AccountSwitcherAvatar
        type={type}
        avatarSrc={avatarSrc}
        fallbackBaseText={title}
        role={firstOrgRole}
      />

      <div className={cn('overflow-hidden', 'text-left space-y-[2px]')}>
        <h2
          className={cn(
            'truncate',
            type === 'regular' && 'font-medium',
            type === 'compact' && 'text-sm'
          )}
        >
          {title}
        </h2>
        <p className={cn('truncate', 'text-xs text-neutral-gray-600')}>
          {subtitle}
        </p>
      </div>
    </section>
  )
}

function AccountSwitcherItemLink(
  props: PropsWithChildren<{
    orgPathname: string
    isCurrentOrg?: boolean
  }>
) {
  const { orgPathname, isCurrentOrg } = props
  const { children } = props

  if (isCurrentOrg) {
    return children
  }

  return (
    <Link href={orgPathname} className='w-full'>
      {children}
    </Link>
  )
}

function AccountSwitcherItem(props: {
  currentMembership: OrganizationMembership
  membership: OrganizationMembership
}) {
  const { currentMembership, membership } = props
  const pathname = usePathname()
  const { user } = useUser()

  const currentOrgSlug = currentMembership.organization.slug
  const orgName = membership.organization.name
  const orgSlug = membership.organization.slug

  const firstCurrentOrgRole = currentMembership.roles[0]
  const firstOrgRole = membership.roles[0]

  const isCurrentOrg = currentOrgSlug === orgSlug
  const orgPathname = replaceSlugs(pathname, {
    [currentOrgSlug]: orgSlug,
    [getRoleSlug(firstCurrentOrgRole)]: getRoleSlug(firstOrgRole)
  })

  const isPublicMember = orgName === organizationConfig.PUBLIC_ORGANIZATION_NAME
  const title = isPublicMember ? user?.full_name : orgName

  if (title === undefined) {
    return null
  }

  return (
    <DropdownMenuItem
      disabled={isCurrentOrg}
      className={cn(
        'p-0 rounded-none',
        isCurrentOrg && 'bg-primary-100 data-[disabled]:opacity-100'
      )}
    >
      <AccountSwitcherItemLink
        orgPathname={orgPathname}
        isCurrentOrg={isCurrentOrg}
      >
        <MembershipCard
          type='compact'
          membership={membership}
          title={title}
          subtitle={getSubtitleRoleText(membership)}
          className='px-4 py-2'
        />
      </AccountSwitcherItemLink>
    </DropdownMenuItem>
  )
}

function AccountSwitcherTrigger(props: {
  currentMembership: OrganizationMembership
  disabled?: boolean
  className?: string
}) {
  const { currentMembership } = props
  const { disabled, className } = props

  const { user } = useUser()

  const orgName = currentMembership?.organization.name

  const isPublicMember = orgName === organizationConfig.PUBLIC_ORGANIZATION_NAME
  const title = isPublicMember ? user?.full_name : orgName

  if (title === undefined) {
    return null
  }

  return (
    <DropdownMenuTrigger
      disabled={disabled}
      className={cn(
        'flex gap-2 items-center',
        'rounded-lg p-2',
        'border border-neutral-gray-300',
        'group',
        className
      )}
    >
      <MembershipCard
        membership={currentMembership}
        title={title}
        subtitle={getSubtitleRoleText(currentMembership)}
      />

      {!disabled && (
        <div className='ml-auto'>
          <ChevronDown
            className={cn(
              'size-5',
              'transition group-data-[state=open]:-rotate-180'
            )}
          />
        </div>
      )}
    </DropdownMenuTrigger>
  )
}

function AccountSwitcher(props: { className?: string }) {
  const { className } = props
  const { user } = useUser()
  const { membership: currentMembership } = useOrganization()

  const memberships = user?.organizations ?? []
  const acceptedMemberships = memberships.filter(
    (org) => org.status === invitationStatus.ACCEPTED
  )

  const isSwitcherDisabled = acceptedMemberships.length <= 1

  if (currentMembership === undefined) {
    return null
  }

  return (
    <DropdownMenu>
      <AccountSwitcherTrigger
        currentMembership={currentMembership}
        disabled={isSwitcherDisabled}
        className={className}
      />

      <DropdownMenuContent className='p-0 py-2 w-[var(--radix-dropdown-menu-trigger-width)]'>
        <DropdownMenuLabel className='text-xs text-neutral-gray-600 font-medium uppercase px-4 py-2'>
          Switch Account
        </DropdownMenuLabel>

        {acceptedMemberships.map((membership) => (
          <AccountSwitcherItem
            key={membership.organization.name}
            currentMembership={currentMembership}
            membership={membership}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AccountSwitcher
