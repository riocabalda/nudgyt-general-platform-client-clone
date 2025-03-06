'use client'

import useGetRecentServices from '@/app/(shared)/(users)/[userId]/hooks/useGetRecentServices'
import ServicesList from '@/app/(shared)/(users)/[userId]/ServicesList'
import UserDetails from '@/app/(shared)/(users)/[userId]/UserDetails'
import useGetUser from '@/app/(shared)/hooks/useGetUser'
import useOrganization from '@/app/(shared)/hooks/useOrganization'
import { useRouter } from 'next/navigation'
import Status from '../../components/Status'
import usePageParams from '../_hooks/usePageParams'

function PageContent() {
  const router = useRouter()
  const { orgSlug } = useOrganization()
  const { params } = usePageParams()

  const swrGetUser = useGetUser(orgSlug, params.userId)
  const {
    data: serviceData,
    isLoading: serviceLoading,
    error
  } = useGetRecentServices(orgSlug, params.userId)

  const { isLoading } = swrGetUser
  const user = swrGetUser.data ?? undefined
  const orgMembership = user?.organizations?.find(
    (membership) => membership.organization.slug === orgSlug
  )

  if (isLoading) {
    return null
  }

  if (user === undefined) {
    router.replace(`/${orgSlug}/admin/users`)

    return null
  }

  return (
    <div className='lg:container px-0  lg:space-y-[42px]'>
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-0 lg:gap-6'>
        {/* <LearnerXPSection
                {...learnerExperience?.data}
                fullname={user?.full_name || 'User'}
              />
              <div className='block lg:hidden px-4'>
                <hr className='border-neutral-gray-400' />
              </div> */}
        <UserDetails
          user={user}
          completedServices={serviceData?.data?.serviceCount}
          status={
            <Status user={user} orgMembership={orgMembership} isForUserDetail />
          }
        />
      </div>
      <ServicesList
        serviceData={serviceData?.data?.services}
        error={error}
        isLoading={serviceLoading}
      />
    </div>
  )
}

export default PageContent
