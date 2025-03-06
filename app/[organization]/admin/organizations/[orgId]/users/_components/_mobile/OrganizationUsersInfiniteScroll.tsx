'use client'

import ActionPopover from '@/app/(shared)/(users)/_mobile/ActionPopover'
import SetStatusModal from '@/app/(shared)/(users)/_mobile/SetStatusModal'
import UserCard from '@/app/(shared)/(users)/_mobile/UserCard'
import {
  LoadingMoreIndicator,
  LoadingSpinner
} from '@/app/(shared)/(users)/LoadingStates'
import FetchError from '@/app/(shared)/components/FetchError'
import Search from '@/app/(shared)/components/Search'
import { useUserStore } from '@/app/(shared)/hooks/useUsersStore'
import { useIntersectionObserver } from 'usehooks-ts'
import useGetOrganizationUsersInfinite from '../../_hooks/useGetOrganizationUsersInfinite'
import useOrganizationName from '../../_hooks/useOrganizationName'

function OrganizationUsersEnd() {
  const {
    swrInfinite: { isValidating, setSize },
    isTotalUsers
  } = useGetOrganizationUsersInfinite()

  const { ref } = useIntersectionObserver({
    onChange(isIntersecting) {
      if (!isIntersecting) {
        return
      }

      extendInfiniteFetch()
    }
  })

  function extendInfiniteFetch() {
    setSize((size) => size + 1)
  }

  if (isTotalUsers) {
    return null // Remove observer if no more data
  }

  return (
    <div ref={ref}>
      {isValidating && <LoadingMoreIndicator type='organizations' />}
    </div>
  )
}

function OrganizationUsersInfiniteScroll() {
  const orgName = useOrganizationName()

  const {
    swrInfinite: { data, error, isLoading, mutate },
    usersData
  } = useGetOrganizationUsersInfinite()
  const { clearUsers } = useUserStore()

  const hasStaleData = data !== undefined

  function handleModalClose() {
    clearUsers()
    mutate() // Refresh the data after status change
  }

  if (error) {
    return (
      <div className='grid place-items-center p-4'>
        <FetchError errorMessage={error?.response?.data?.message} />
      </div>
    )
  }

  if (isLoading && !hasStaleData) {
    return <LoadingSpinner />
  }

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex gap-4 bg-white px-4 py-6 border-b border-b-gray-300'>
          <Search />
          <ActionPopover forceOrgName={orgName} />
        </div>
        <div className='flex flex-col gap-4 px-4 py-6'>
          {usersData && usersData?.length ? (
            usersData.map((user) => <UserCard key={user._id} user={user} />)
          ) : (
            <p className='text-center text-foreground'>No data found.</p>
          )}

          <OrganizationUsersEnd />
        </div>
      </div>
      <SetStatusModal onCancel={handleModalClose} />
    </>
  )
}

export default OrganizationUsersInfiniteScroll
