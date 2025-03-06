'use client'

import {
  LoadingMoreIndicator,
  LoadingSpinner
} from '@/app/(shared)/(users)/LoadingStates'
import FetchError from '@/app/(shared)/components/FetchError'
import Search from '@/app/(shared)/components/Search'
import { useIntersectionObserver } from 'usehooks-ts'
import useGetOrganizationsInfinite from '../../../_hooks/useGetOrganizationsInfinite'
import useOrganizationsStore from '../../../_hooks/useOrganizationsStore'
import OrganizationActionPopover from './OrganizationActionPopover'
import OrganizationCard from './OrganizationCard'
import SetStatusModal from './SetStatusModal'

function OrganizationsTabEnd() {
  const {
    swrInfinite: { isValidating, setSize },
    isTotalOrganizations
  } = useGetOrganizationsInfinite()

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

  if (isTotalOrganizations) {
    return null // Remove observer if no more data
  }

  return (
    <div ref={ref}>
      {isValidating && <LoadingMoreIndicator type='organizations' />}
    </div>
  )
}

function OrganizationsTabInfinite() {
  const { clearOrganizations } = useOrganizationsStore()
  const {
    swrInfinite: { data, error, isLoading, mutate },
    organizationsData
  } = useGetOrganizationsInfinite()

  const hasStaleData = data !== undefined
  const hasOrganizationsData = organizationsData.length > 0

  function handleModalClose() {
    clearOrganizations()
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
          <OrganizationActionPopover />
        </div>
        <div className='flex flex-col gap-4 px-4 py-6'>
          {hasOrganizationsData ? (
            organizationsData.map((organization) => (
              <OrganizationCard
                key={organization._id}
                organization={organization}
              />
            ))
          ) : (
            <p className='text-center text-foreground'>No data found.</p>
          )}

          <OrganizationsTabEnd />
        </div>
      </div>
      <SetStatusModal onCancel={handleModalClose} />
    </>
  )
}

export default OrganizationsTabInfinite
