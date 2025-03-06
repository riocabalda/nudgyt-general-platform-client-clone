'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/app/(shared)/components/ui/avatar'
import { Badge } from '@/app/(shared)/components/ui/badge'
import { Card } from '@/app/(shared)/components/ui/card'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import useGetSimulationResults from '../hooks/useGetSimulationResults'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { generateAvatarInitials, orgPrefixRoute } from '@/app/(shared)/utils'

function UserProfileHeadline() {
  const { orgSlug, membership } = useOrganization()
  const { details } = useGetSimulationResults()
  const role = orgPrefixRoute(membership?.roles || [])
  return (
    <Card className='p-4 flex justify-between items-center gap-2'>
      <div className='flex items-center gap-4'>
        <Avatar className='size-12 lg:size-16'>
          <AvatarFallback className='text-xl bg-red-500 text-white'>
            {generateAvatarInitials(details?.learner?.fullname ?? '')}
          </AvatarFallback>
          <AvatarImage />
        </Avatar>
        <div className='flex flex-col gap-1'>
          <h3 className='text-base lg:text-xl'>{details?.learner?.fullname}</h3>
          <div>
            <Badge className='bg-gray-50 text-neutral-gray-600 uppercase text-xs rounded-sm'>
              Learner
            </Badge>
          </div>
        </div>
      </div>
      <Link
        href={`/${orgSlug}/${role?.toLowerCase()}/users/${details?.learner?._id}`}
        className='text-sm lg:text-base flex items-center gap-2 text-purple-shade-darkest2 text-nowrap'
      >
        Go to profile <ArrowRightIcon className='size-4 text-sm' />
      </Link>
    </Card>
  )
}

export default UserProfileHeadline
