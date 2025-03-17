'use client'

import DescriptionList from '@/app/(shared)/components/DescriptionList'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/app/(shared)/components/ui/avatar'
import { Button } from '@/app/(shared)/components/ui/button'
import { Card } from '@/app/(shared)/components/ui/card'
import useGetOrganization from '@/app/(shared)/hooks/useGetOrganization'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { OrganizationDisplay } from '@/app/(shared)/types'
import { formatDateTime, generateAvatarInitials } from '@/app/(shared)/utils'
import Link from 'next/link'

function OrganizationProfileFooter() {
  const { orgSlug } = useOrganization()

  return (
    <footer className='grid'>
      <Button asChild variant='outline'>
        <Link href={`/${orgSlug}/admin/settings/general/details`}>
          Edit Organization Details
        </Link>
      </Button>
    </footer>
  )
}

function OrganizationProfileAvatar(props: {
  organization: OrganizationDisplay
}) {
  const { organization } = props

  const fallbackBaseText = organization.name

  const avatarSrc = organization.logo

  return (
    <Avatar className='size-20'>
      <AvatarImage src={avatarSrc} className='object-cover' />
      <AvatarFallback className='text-white bg-brandcolora text-4xl select-none'>
        {generateAvatarInitials(fallbackBaseText)}
      </AvatarFallback>
    </Avatar>
  )
}

function OrganizationProfileCard(props: { organization: OrganizationDisplay }) {
  const { organization } = props

  const orgCode = organization.code
  const memberCt = organization.member_count
  const joinDate = organization.created_at
  const learnerCt = organization.learner_count
  const maxLearners = organization.subscription?.subscription_plan?.max_learners
  const extraLearners = organization.subscription?.extra_learners || 0

  const learnerLimitDescription =
    extraLearners > 0
      ? `${maxLearners + extraLearners}  (${maxLearners} + ${extraLearners})`
      : maxLearners
  return (
    <Card className='shadow-sm rounded-none lg:rounded-lg py-10 px-4 lg:px-20 space-y-6'>
      <div className='grid place-items-center'>
        <OrganizationProfileAvatar organization={organization} />
      </div>

      <header className='text-center text-lg lg:text-xl font-semibold text-neutral-gray-800'>
        {organization.name}
      </header>

      <DescriptionList>
        <DescriptionList.Item title='Organization Code' description={orgCode} />

        <DescriptionList.Item title='Platform Users' description={memberCt} />
        <DescriptionList.Item
          title='Current learners'
          description={learnerCt}
        />
        <DescriptionList.Item
          title='Learner limit'
          description={learnerLimitDescription}
        />

        <DescriptionList.Item
          title='Date Joined'
          description={formatDateTime(joinDate)}
        />
      </DescriptionList>

      <OrganizationProfileFooter />
    </Card>
  )
}

function OrganizationProfile() {
  const { data: organization } = useGetOrganization()

  if (organization === undefined) {
    return null
  }

  return <OrganizationProfileCard organization={organization} />
}

export default OrganizationProfile
