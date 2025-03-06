'use client'

import DescriptionList from '@/app/(shared)/components/DescriptionList'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/app/(shared)/components/ui/avatar'
import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'
import organizationConfig from '@/app/(shared)/config/organizationConfig'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import useUser from '@/app/(shared)/hooks/useUser'
import {
  cn,
  formatDateTime,
  generateAvatarInitials
} from '@/app/(shared)/utils'
import Link from 'next/link'

function EditProfileLink() {
  const { orgSlug } = useOrganization()

  return (
    <>
      <Button asChild variant='outline' className='hidden lg:flex'>
        <Link href={`/${orgSlug}/admin/account/personal-details`}>
          Edit Profile
        </Link>
      </Button>

      <Button asChild variant='outline' className='lg:hidden'>
        <Link href={`/${orgSlug}/admin/account/mobile/personal-details`}>
          Edit Profile
        </Link>
      </Button>
    </>
  )
}

function ChangePasswordLink() {
  const { orgSlug } = useOrganization()

  return (
    <>
      <Button asChild variant='outline' className='hidden lg:flex'>
        <Link href={`/${orgSlug}/admin/account/change-password`}>
          Change Password
        </Link>
      </Button>

      <Button asChild variant='outline' className='lg:hidden'>
        <Link href={`/${orgSlug}/admin/account/mobile/change-password`}>
          Change Password
        </Link>
      </Button>
    </>
  )
}

function ProfileSubtitle(props: { className?: string }) {
  const { className } = props
  const { membership } = useOrganization()

  const firstOrgRole = membership?.roles[0]
  const orgName = membership?.organization.name

  const isPublicMember = orgName === organizationConfig.PUBLIC_ORGANIZATION_NAME
  const subtitle = isPublicMember ? firstOrgRole : orgName

  if (subtitle === undefined) {
    return null
  }

  return (
    <p className={cn('text-sm text-neutral-gray-600', className)}>{subtitle}</p>
  )
}

function ProfileAvatar() {
  const { user } = useUser()
  const { membership } = useOrganization()

  const fallbackBaseText = user?.full_name ?? 'N'

  const avatarSrc = membership?.organization.logo

  return (
    <Avatar className='size-20'>
      <AvatarImage src={avatarSrc} className='object-cover' />
      <AvatarFallback className='text-white bg-primary-500 text-4xl'>
        {generateAvatarInitials(fallbackBaseText)}
      </AvatarFallback>
    </Avatar>
  )
}

function Profile(props: { className?: string }) {
  const { className } = props
  const { user } = useUser()

  const fullName = user?.full_name
  const email = user?.email
  const contact = user?.contact
  const joinDate = user?.created_at

  const isSuperAdmin = user?.is_super_admin ?? false

  return (
    <Card
      className={cn(
        className,
        'shadow-sm rounded-none lg:rounded-[8px] py-10 px-4 lg:px-20 space-y-6'
      )}
    >
      <header className='space-y-6 *:mx-auto'>
        <ProfileAvatar />

        <div className='space-y-2'>
          <p className='text-center text-xl font-semibold text-foreground-800'>
            {fullName}
          </p>

          <ProfileSubtitle className='text-center' />
        </div>
      </header>

      <DescriptionList>
        <DescriptionList.Item title='Email Address' description={email} />
        <DescriptionList.Item title='Phone Number' description={contact} />

        {joinDate !== undefined && (
          <DescriptionList.Item
            title='Date Joined'
            description={formatDateTime(joinDate)}
          />
        )}
      </DescriptionList>

      {!isSuperAdmin && (
        <footer className='grid lg:grid-cols-2 gap-4'>
          <EditProfileLink />
          <ChangePasswordLink />
        </footer>
      )}
    </Card>
  )
}

export default Profile
